'use client';

import { useAccount } from "wagmi";
import { useState } from "react";
import { uploadFileToIPFS } from "../../lib/upload";
import { mintNFT } from "../../lib/mint";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { address } = useAccount();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    
    // Only take the first file if multiple are selected
    const file = files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function handleMint() {
    if (!address || !image) return;

    setMinting(true);
    setTxHash(null);
    try {
      const uri = await uploadFileToIPFS(image);
      const result = await mintNFT(address, uri);
      setTxHash(result);
      alert("Minted successfully!");
    } catch (err) {
      console.error(err);
      alert("Mint failed.");
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* ConnectButton positioned in top right */}
      <div className="absolute top-4 right-4 z-10">
        <ConnectButton />
      </div>
      
      {/* Main content */}
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-md w-full">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">NFT Minting</h1>
            <p className="text-gray-600">Upload an image to mint your NFT</p>
          </div>

          {/* File upload area */}
          <div className="w-full">
            <label 
              htmlFor="image-upload" 
              className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors duration-200"
            >
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-gray-600">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (one image only)</p>
              </div>
            </label>
            <input 
              id="image-upload"
              type="file" 
              accept="image/*" 
              multiple={false}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
              <div className="relative group">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Mint button */}
          <button
            disabled={!image || !address || minting}
            onClick={handleMint}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {minting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minting...
              </div>
            ) : (
              "Mint NFT"
            )}
          </button>

          {/* Transaction Hash Display */}
          {txHash && (
            <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-green-800">Minting Successful!</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">Your NFT has been minted successfully. Here's your transaction hash:</p>
              <div className="bg-white border border-green-200 rounded p-3">
                <p className="text-xs font-mono text-green-800 break-all">{txHash}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(txHash)}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                >
                  Copy Hash
                </button>
                <a
                  href={`https://basecamp.cloud.blockscout.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  View on Blockscout
                </a>
              </div>
            </div>
          )}

          {/* Status messages */}
          {!address && (
            <div className="text-center text-orange-600 bg-orange-50 p-3 rounded-lg">
              Please connect your wallet to mint an NFT
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

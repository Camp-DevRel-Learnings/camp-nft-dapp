export async function uploadFileToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }

  const result = await response.json();
  return `ipfs://${result.IpfsHash}/${file.name}`;
}

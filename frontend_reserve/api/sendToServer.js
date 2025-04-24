

export const logExportedData = async (csvBlob) => {
  try {
    await fetch('https://your-api-endpoint.com/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: csvBlob,
    });
    console.log('CSV log sent to server successfully.');
  } catch (error) {
    console.error('Failed to log CSV to server:', error);
  }
};
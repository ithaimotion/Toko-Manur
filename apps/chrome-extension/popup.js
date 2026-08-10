document.getElementById('syncBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const btn = document.getElementById('syncBtn');
  
  statusDiv.style.display = 'block';
  statusDiv.className = '';
  statusDiv.textContent = 'Memeriksa halaman...';
  btn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('shopee.co.id') && !tab.url.includes('tokopedia.com') && !tab.url.includes('lazada.co.id')) {
      throw new Error('Ekstensi ini hanya bekerja di halaman produk Shopee, Tokopedia, dan Lazada.');
    }

    // Execute the content script in the current tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, (results) => {
      if (chrome.runtime.lastError) {
        statusDiv.className = 'error';
        statusDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        btn.disabled = false;
        return;
      }
      
      // We expect the content script to return a message via chrome.runtime.sendMessage,
      // but to keep it simple, the content script handles the API POST directly and returns the result string.
      const result = results[0].result;
      if (result && result.success) {
        statusDiv.className = 'success';
        statusDiv.textContent = `Berhasil! ${result.count} ulasan ditarik.`;
      } else {
        statusDiv.className = 'error';
        statusDiv.textContent = result?.error || 'Gagal menarik ulasan.';
      }
      btn.disabled = false;
    });
  } catch (error) {
    statusDiv.className = 'error';
    statusDiv.textContent = error.message;
    btn.disabled = false;
  }
});

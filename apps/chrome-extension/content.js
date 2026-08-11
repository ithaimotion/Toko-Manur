(async () => {
  try {
    const hostname = window.location.hostname;
    let marketplace = 'UNKNOWN';
    if (hostname.includes('shopee.co.id')) marketplace = 'SHOPEE';
    else if (hostname.includes('tokopedia.com')) marketplace = 'TOKOPEDIA';
    else if (hostname.includes('lazada.co.id')) marketplace = 'LAZADA';

    if (marketplace === 'UNKNOWN') return { error: 'Marketplace tidak didukung oleh ekstensi ini.' };

    const scrapedReviews = [];
    
    // Extract product name
    let productName = 'Unknown Product';
    const titleEl = document.querySelector('h1, .WB3bZ2, .Y3DvsN, span[data-testid="lblPDPDetailProductName"], .pdp-mod-product-badge-title');
    if (titleEl) productName = titleEl.textContent.trim();

    if (marketplace === 'SHOPEE') {
      const dateRegex = /20\d{2}-\d{2}-\d{2} \d{2}:\d{2}/;
      const allTextNodes = [];
      const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let currentNode;
      while (currentNode = treeWalker.nextNode()) {
        const txt = currentNode.nodeValue.trim();
        if (txt.length > 0) allTextNodes.push(txt);
      }

      const dateIndices = [];
      for (let i = 0; i < allTextNodes.length; i++) {
        if (dateRegex.test(allTextNodes[i])) dateIndices.push(i);
      }

      if (dateIndices.length === 0) {
        return { error: 'Tidak ada ulasan Shopee yang ditemukan. Pastikan Anda sudah scroll ke bagian ulasan.' };
      }

      for (let j = 0; j < dateIndices.length; j++) {
        const dateIndex = dateIndices[j];
        const nextDateIndex = j < dateIndices.length - 1 ? dateIndices[j + 1] : -1;
        const dateText = allTextNodes[dateIndex];
        const dateMatch = dateText.match(dateRegex);
        const reviewDate = dateMatch ? new Date(dateMatch[0]) : new Date();

        let username = 'Anonymous';
        if (dateIndex > 0) {
          username = allTextNodes[dateIndex - 1];
          if (username.length > 50) username = 'Anonymous';
        }

        const commentParts = [];
        const endIndex = nextDateIndex !== -1 ? nextDateIndex - 1 : Math.min(allTextNodes.length, dateIndex + 25);
        const exactIgnores = ['Membantu?', 'Bermanfaat?', 'Laporkan Ulasan Ini', 'Seller Response:', 'Respons Penjual:'];
        
        for (let k = dateIndex + 1; k < endIndex; k++) {
          const txt = allTextNodes[k];
          if (nextDateIndex === -1 && (/^\d+$/.test(txt) || txt === 'Sebelumnya' || txt === 'Selanjutnya' || txt === 'Beli Sekarang')) break;
          const isIgnore = exactIgnores.includes(txt) || /^\d+:\d+$/.test(txt);
          if (!isIgnore && txt.length > 1) commentParts.push(txt);
        }

        scrapedReviews.push({
          reviewId: `ext-shp-${Date.now()}-${j}`,
          productName,
          username,
          rating: 5,
          comment: commentParts.join('\n').trim(),
          reviewDate: reviewDate.toISOString(),
          images: [],
          videos: []
        });
      }
    } 
    else if (marketplace === 'TOKOPEDIA') {
      const allTextNodes = [];
      const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let currentNode;
      while (currentNode = treeWalker.nextNode()) {
        const txt = currentNode.nodeValue.trim();
        if (txt.length > 0) allTextNodes.push(txt);
      }

      const membantuIndices = [];
      for (let i = 0; i < allTextNodes.length; i++) {
        if (allTextNodes[i] === 'Membantu') {
          membantuIndices.push(i);
        }
      }

      if (membantuIndices.length === 0) {
        return { error: 'Tidak ada ulasan Tokopedia yang ditemukan. Pastikan Anda sudah scroll ke ulasan pembeli.' };
      }

      for (let j = 0; j < membantuIndices.length; j++) {
        const endIndex = membantuIndices[j];
        // Mulai dari setelah tombol Membantu sebelumnya
        let startIndex = j === 0 ? Math.max(0, endIndex - 15) : membantuIndices[j-1] + 1;
        
        const reviewTexts = [];
        const ignoreList = ['Paling Membantu', 'Terbaru', 'Dengan Foto & Video', 'ULASAN PILIHAN', 'Urutkan', 'Ulasan', 'Rekomendasi'];
        
        for (let k = startIndex; k < endIndex; k++) {
          const txt = allTextNodes[k];
          
          // Reset jika kita mengambil teks UI atas (khusus ulasan pertama)
          if (j === 0 && (txt.includes('Menampilkan') || txt === 'Paling Membantu')) {
             reviewTexts.length = 0; 
             continue;
          }
          
          if (ignoreList.includes(txt)) continue;
          if (txt.match(/\d+ (hari|minggu|bulan|tahun) lalu/i)) continue; 
          if (txt === 'Lebih dari 1 tahun lalu') continue;
          if (txt.includes('Balasan dari Penjual')) continue; 
          
          // Abaikan teks metadata Tokopedia seperti "Varian: Biru" atau "Kemasan: Bagus"
          if (/^(Varian|Kemasan|Kualitas pengerjaan|Warna|Harga|Kualitas|Ketepatan|Material|Spesifikasi|Ukuran|Ketahanan):/i.test(txt)) {
             continue;
          }

          reviewTexts.push(txt);
        }

        let username = 'Anonymous';
        let comment = '';

        if (reviewTexts.length > 0) {
          username = reviewTexts[0];
          if (username.length > 40) username = 'Anonymous'; 
          
          if (reviewTexts.length > 1) {
             reviewTexts.shift(); 
             comment = reviewTexts.join('\n');
          }
        }

        scrapedReviews.push({
          reviewId: `ext-tok-${Date.now()}-${j}`,
          productName,
          username,
          rating: 5,
          comment,
          reviewDate: new Date().toISOString(),
          images: [],
          videos: []
        });
      }
    }
    else if (marketplace === 'LAZADA') {
      // Gunakan text-node walking dengan "Helpful" sebagai pemisah blok ulasan
      const allTextNodes = [];
      const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let currentNode;
      while (currentNode = treeWalker.nextNode()) {
        const txt = currentNode.nodeValue.trim();
        if (txt.length > 0) allTextNodes.push(txt);
      }

      // Lazada menggunakan "Helpful(X)" atau "Helpful" sebagai akhir setiap blok ulasan
      const helpfulIndices = [];
      for (let i = 0; i < allTextNodes.length; i++) {
        if (/^Helpful(\(\d+\))?$/.test(allTextNodes[i].trim())) {
          helpfulIndices.push(i);
        }
      }

      if (helpfulIndices.length === 0) {
        return { error: 'Tidak ada ulasan Lazada yang ditemukan. Pastikan Anda sudah scroll ke bagian ulasan.' };
      }

      const lazadaIgnore = ['Verified Purchase', 'Size', 'Color', 'Style', 'Material', 'Report'];
      const lazadaDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      for (let j = 0; j < helpfulIndices.length; j++) {
        const endIndex = helpfulIndices[j];
        const startIndex = j === 0 ? Math.max(0, endIndex - 20) : helpfulIndices[j-1] + 1;

        const reviewTexts = [];
        let reviewDate = new Date().toISOString();

        for (let k = startIndex; k < endIndex; k++) {
          const txt = allTextNodes[k].trim();
          if (!txt || txt.length < 2) continue;
          if (lazadaIgnore.some(ig => txt.startsWith(ig + ':'))) continue;
          if (/^\d+(\.\d+)?$/.test(txt)) continue; // angka rating
          if (/^[★☆]+$/.test(txt)) continue;

          // Tangkap tanggal
          if (lazadaDateRegex.test(txt)) {
            reviewDate = new Date(txt).toISOString();
            continue;
          }
          reviewTexts.push(txt);
        }

        let username = 'Anonymous';
        let comment = '';

        if (reviewTexts.length > 0) {
          // Username biasanya teks pertama (format: m***h atau nama tersensor)
          username = reviewTexts[0];
          if (username.length > 50) username = 'Anonymous';

          if (reviewTexts.length > 1) {
            reviewTexts.shift();
            // Buang teks pendek yg bukan komentar (misal: "L44 - 2 BALL", "Ukuran Popok:")
            const commentLines = reviewTexts.filter(t => 
              t.length > 5 && 
              !/^(Ukuran Popok|Varian|Warna|Size|Color):/i.test(t)
            );
            comment = commentLines.join('\n').trim();
          }
        }

        scrapedReviews.push({
          reviewId: `ext-laz-${Date.now()}-${j}`,
          productName,
          username,
          rating: 5,
          comment,
          reviewDate,
          images: [],
          videos: []
        });
      }
    }

    if (scrapedReviews.length === 0) {
      return { error: `Gagal mengekstrak teks ulasan dari ${marketplace}. Format tidak dikenali.` };
    }

    // Send to Localhost API
    const response = await fetch('http://localhost:3000/api/reviews/extension-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        marketplace,
        productUrl: window.location.href,
        reviews: scrapedReviews
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return { error: err.error || 'Server menolak data.' };
    }

    const data = await response.json();
    return { success: true, count: data.syncedCount || scrapedReviews.length };

  } catch (error) {
    return { error: error.message };
  }
})();

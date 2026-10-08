/* Dataset for "A Nation of Cousins".
   Populations in thousands. Anchor years only; the page interpolates between them.
   Negative years are BCE. Regions use fixed outlines over time (Poland = its 1921-39 borders, and so on). */
const ATLAS = (function () {
  const GROUPS = [
    { id: 'isr', name: 'Judean / Levantine', note: 'Israelites, Judeans and the Jews who stayed in the Levant', color: '#c98500' },
    { id: 'miz', name: 'Mizrahi', note: 'The Babylonian and Persian line: Iraq, Iran, Bukhara, the Caucasus', color: '#d95926' },
    { id: 'yem', name: 'Yemenite', note: 'South Arabia, isolated for about 1,500 years', color: '#d55181' },
    { id: 'med', name: 'Greco-Roman diaspora', note: 'Hellenistic and Roman communities; today the Italkim and Romaniotes', color: '#199e70' },
    { id: 'sef', name: 'Sephardi', note: 'Iberia, then the Ottoman lands and the Atlantic ports', color: '#008300' },
    { id: 'mag', name: 'Maghrebi', note: 'Morocco, Algeria, Tunisia, Libya', color: '#e66767' },
    { id: 'ash', name: 'Ashkenazi', note: 'The Rhineland, then Eastern Europe, then everywhere', color: '#3987e5' },
    { id: 'eth', name: 'Beta Israel', note: 'Ethiopia', color: '#9085e9' },
    { id: 'ind', name: 'Indian', note: 'Bene Israel and Cochin Jews', color: '#8a93a8' }
  ];

  /* helper: split a total series by share tables (shares interpolated linearly, then normalised) */
  function lin(arr, y) {
    if (y <= arr[0][0]) return arr[0][1];
    for (let i = 1; i < arr.length; i++) if (y <= arr[i][0]) {
      const [a, va] = arr[i - 1], [b, vb] = arr[i]; return va + (vb - va) * (y - a) / (b - a);
    }
    return arr[arr.length - 1][1];
  }
  function split(totals, shares) {
    const out = {};
    for (const g in shares) out[g] = [];
    for (const [y, v] of totals) {
      let sum = 0; const s = {};
      for (const g in shares) { s[g] = Math.max(0, lin(shares[g], y)); sum += s[g]; }
      for (const g in shares) out[g].push([y, +(v * s[g] / sum).toFixed(2)]);
    }
    return out;
  }

  const R = [];
  function reg(id, name, lat, lon, series) { R.push({ id, name, lat, lon, series }); }

  /* ---------- Levant and Middle East ---------- */
  const israelModern = split(
    [[1500, 7], [1550, 12], [1600, 9], [1700, 6], [1800, 7], [1850, 13], [1880, 25], [1900, 50], [1914, 85], [1918, 56], [1925, 122], [1931, 175], [1939, 450], [1945, 565], [1948, 680], [1951, 1404], [1955, 1590], [1960, 1911], [1970, 2582], [1980, 3283], [1990, 3947], [1995, 4522], [2000, 4955], [2010, 5803], [2020, 6870], [2025, 7300]],
    {
      isr: [[1500, 70], [1600, 20], [1700, 10], [1800, 5], [1880, 0]],
      sef: [[1500, 28], [1600, 75], [1800, 75], [1880, 58], [1914, 25], [1939, 9], [1948, 7], [1951, 10], [1970, 9.5], [1990, 9], [2000, 7.5], [2025, 7.5]],
      ash: [[1500, 2], [1700, 12], [1800, 18], [1880, 36], [1914, 60], [1939, 77], [1948, 80], [1951, 58], [1970, 47], [1990, 44], [2000, 49], [2025, 46]],
      mag: [[1500, 0], [1800, 2], [1880, 4], [1914, 4], [1939, 2], [1948, 2], [1951, 9], [1970, 19], [1990, 21], [2000, 18.5], [2025, 19.5]],
      yem: [[1880, 0], [1885, 1.5], [1914, 6], [1939, 6], [1948, 5], [1951, 7], [1970, 6.5], [1990, 6.5], [2000, 6], [2025, 6]],
      miz: [[1800, 0], [1880, 1], [1914, 5], [1939, 6], [1948, 6], [1951, 15], [1970, 17], [1990, 18], [2000, 16.5], [2025, 17.5]],
      ind: [[1948, 0], [1951, 0.2], [1970, 0.9], [1990, 1.1], [2025, 1.2]],
      eth: [[1977, 0], [1984, 0.2], [1986, 0.5], [1990, 0.6], [1992, 1.0], [2000, 1.7], [2010, 2.1], [2025, 2.3]]
    });
  israelModern.isr = [[-1000, 120], [-750, 450], [-722, 450], [-720, 250], [-701, 240], [-700, 200], [-600, 180], [-587, 150], [-582, 50], [-500, 40], [-400, 60], [-300, 120], [-200, 200], [-100, 600], [1, 1800], [66, 2500], [74, 1800], [131, 1500], [136, 1200], [300, 500], [400, 300], [550, 200], [614, 150], [650, 100], [800, 60], [1000, 30], [1098, 20], [1100, 6], [1170, 5], [1300, 4], [1400, 4], [1500, 4.9]].concat(israelModern.isr.slice(1));
  reg('israel', 'Land of Israel', 31.8, 35.0, israelModern);

  reg('iraq', 'Babylonia / Iraq', 33.0, 44.4, {
    miz: [[-598, 0], [-597, 10], [-580, 20], [-500, 40], [-300, 100], [-100, 300], [1, 500], [66, 700], [150, 800], [300, 850], [500, 800], [650, 650], [800, 700], [900, 750], [1000, 700], [1170, 650], [1250, 500], [1257, 480], [1260, 160], [1300, 130], [1393, 110], [1402, 70], [1500, 70], [1600, 50], [1700, 40], [1800, 40], [1850, 50], [1900, 80], [1920, 90], [1939, 110], [1948, 135], [1950, 125], [1952, 6], [1960, 5], [1970, 2.5], [1980, 0.3], [2003, 0.03], [2010, 0]]
  });
  reg('iran', 'Persia / Iran', 32.6, 52.5, {
    miz: [[-539, 0], [-500, 15], [-300, 50], [-100, 120], [66, 300], [300, 300], [500, 280], [650, 200], [1000, 250], [1170, 300], [1219, 280], [1260, 120], [1300, 100], [1400, 80], [1500, 100], [1600, 90], [1655, 85], [1665, 60], [1700, 60], [1800, 50], [1850, 40], [1900, 50], [1939, 80], [1948, 100], [1953, 80], [1970, 72], [1978, 80], [1986, 28], [1990, 22], [2000, 12], [2010, 10], [2025, 9]]
  });
  reg('casia', 'Bukhara & Central Asia', 39.8, 65.5, {
    miz: [[400, 0], [500, 5], [900, 20], [1170, 40], [1219, 35], [1230, 10], [1400, 8], [1600, 10], [1800, 12], [1850, 16], [1900, 22], [1939, 35], [1970, 45], [1989, 45], [1995, 15], [2000, 6], [2025, 1.5]],
    ash: [[1860, 0], [1900, 3], [1939, 60], [1941, 65], [1943, 220], [1946, 130], [1959, 110], [1989, 90], [1995, 35], [2000, 15], [2025, 4]]
  });
  reg('caucasus', 'Georgia & the Caucasus', 41.9, 45.5, {
    miz: [[0, 0], [100, 3], [500, 10], [1000, 15], [1500, 15], [1800, 25], [1850, 30], [1900, 45], [1939, 75], [1970, 105], [1979, 85], [1989, 60], [1995, 30], [2000, 20], [2025, 11]],
    ash: [[1820, 0], [1850, 2], [1900, 15], [1939, 60], [1959, 55], [1970, 50], [1989, 30], [1995, 12], [2000, 8], [2025, 2]]
  });
  reg('syria', 'Syria & Lebanon', 34.6, 37.2, {
    isr: [[-300, 0], [-200, 30], [-100, 100], [66, 300], [150, 250], [300, 150], [500, 60], [650, 8], [900, 15], [1170, 15], [1300, 10], [1400, 9], [1402, 6], [1500, 8], [1600, 4], [1700, 0]],
    sef: [[1500, 0], [1550, 6], [1600, 12], [1700, 18], [1800, 25], [1850, 25], [1900, 30], [1939, 30], [1947, 35], [1952, 15], [1960, 13], [1970, 7], [1980, 5], [1991, 4.5], [1995, 0.3], [2010, 0.05], [2025, 0]]
  });
  reg('yemen', 'Yemen', 15.4, 44.2, {
    yem: [[100, 0], [200, 5], [400, 30], [525, 40], [650, 30], [1000, 30], [1170, 40], [1500, 30], [1678, 35], [1681, 25], [1800, 40], [1850, 45], [1900, 60], [1914, 55], [1939, 55], [1949, 52], [1951, 4], [1960, 2], [1990, 1.2], [1995, 0.4], [2010, 0.2], [2021, 0.01], [2025, 0]]
  });
  reg('egypt', 'Egypt', 30.3, 31.0, {
    isr: [[-590, 0], [-580, 5], [-400, 10], [-300, 15], [-200, 0]],
    med: [[-331, 0], [-250, 60], [-100, 300], [1, 600], [66, 800], [115, 800], [118, 60], [300, 40], [415, 30], [650, 15], [800, 0]],
    isr2: null,
    sef: [[1500, 0], [1520, 3], [1600, 7], [1800, 7], [1850, 7], [1900, 25], [1939, 67], [1948, 75], [1950, 45], [1956, 40], [1958, 15], [1967, 2.5], [1970, 0.5], [2000, 0.1], [2025, 0]]
  });
  /* medieval Egypt (Fustat, the Geniza community) belongs with the Levantine group */
  R[R.length - 1].series.isr = R[R.length - 1].series.isr.concat([[650, 0], [800, 15], [1000, 25], [1170, 30], [1300, 20], [1500, 8], [1600, 3], [1700, 0]]);
  delete R[R.length - 1].series.isr2;

  reg('turkey', 'Asia Minor / Turkey', 39.6, 30.5, {
    med: [[-250, 0], [-200, 10], [-100, 80], [66, 200], [150, 180], [300, 120], [500, 60], [650, 25], [1000, 15], [1170, 20], [1300, 12], [1453, 10], [1500, 8], [1600, 5], [1700, 2], [1800, 1], [1900, 0]],
    sef: [[1492, 0], [1493, 12], [1500, 30], [1550, 55], [1600, 65], [1700, 65], [1800, 75], [1850, 85], [1900, 120], [1914, 120], [1927, 80], [1939, 78], [1948, 80], [1950, 45], [1960, 40], [1970, 35], [1980, 23], [1990, 20], [2000, 18], [2010, 17], [2025, 14]]
  });
  reg('india', 'India', 16.5, 74.5, {
    ind: [[900, 0], [1000, 1], [1500, 2], [1700, 5], [1800, 8], [1900, 18], [1948, 28], [1960, 15], [1970, 9], [2000, 5.5], [2025, 4.8]]
  });

  /* ---------- Africa ---------- */
  reg('libya', 'Cyrenaica / Libya', 32.6, 20.5, {
    med: [[-320, 0], [-300, 5], [-100, 40], [66, 100], [115, 100], [118, 5], [300, 5], [650, 0]],
    mag: [[300, 0], [650, 5], [1000, 8], [1500, 5], [1800, 10], [1850, 12], [1900, 20], [1939, 30], [1948, 38], [1952, 4], [1967, 4], [1970, 0.1], [2003, 0]]
  });
  reg('tunisia', 'Tunisia', 35.6, 10.0, {
    mag: [[-150, 0], [100, 10], [300, 30], [650, 15], [900, 30], [1050, 30], [1100, 15], [1170, 8], [1300, 10], [1500, 12], [1700, 20], [1800, 20], [1850, 25], [1900, 60], [1939, 85], [1948, 105], [1956, 80], [1960, 60], [1967, 20], [1970, 9], [1990, 2], [2025, 1]]
  });
  reg('algeria', 'Algeria', 36.2, 3.2, {
    mag: [[0, 0], [100, 3], [300, 10], [650, 8], [1000, 15], [1170, 8], [1390, 10], [1500, 14], [1600, 20], [1700, 22], [1800, 25], [1850, 26], [1880, 35], [1900, 57], [1914, 70], [1939, 120], [1948, 140], [1960, 130], [1963, 5], [1970, 1], [2000, 0]],
    sef: [[1390, 0], [1392, 4], [1500, 9], [1600, 6], [1700, 3], [1800, 0]]
  });
  reg('morocco', 'Morocco', 33.3, -6.3, {
    mag: [[0, 0], [100, 2], [300, 10], [650, 15], [1000, 40], [1147, 40], [1170, 20], [1300, 30], [1490, 40], [1600, 50], [1700, 50], [1800, 70], [1850, 95], [1900, 110], [1939, 200], [1948, 265], [1956, 200], [1960, 160], [1967, 60], [1970, 40], [1980, 17], [1990, 8], [2000, 5.5], [2010, 2.7], [2025, 2]],
    sef: [[1492, 0], [1493, 20], [1600, 25], [1700, 20], [1800, 10], [1850, 5], [1900, 0]]
  });
  reg('ethiopia', 'Ethiopia', 12.8, 37.6, {
    eth: [[1200, 0], [1300, 40], [1600, 100], [1630, 80], [1700, 80], [1800, 80], [1850, 70], [1888, 65], [1900, 50], [1939, 30], [1970, 28], [1984, 25], [1986, 17], [1990, 22], [1991, 22], [1992, 5], [2000, 3], [2010, 2], [2025, 0.1]]
  });
  reg('safrica', 'South Africa', -28.5, 26.5, {
    ash: [[1820, 0], [1850, 0.5], [1880, 4], [1900, 30], [1914, 50], [1925, 65], [1939, 91], [1950, 105], [1960, 115], [1970, 118], [1980, 118], [1990, 100], [2000, 80], [2010, 70], [2025, 50]]
  });

  /* ---------- Mediterranean Europe ---------- */
  reg('balkans', 'Greece & the Balkans', 41.0, 22.6, {
    med: [[-200, 0], [-100, 15], [66, 80], [150, 70], [300, 50], [500, 30], [650, 15], [1000, 15], [1170, 20], [1300, 15], [1450, 12], [1500, 10], [1600, 8], [1800, 8], [1900, 10], [1939, 8], [1941, 8], [1945, 2], [2025, 1]],
    sef: [[1492, 0], [1493, 10], [1500, 30], [1550, 50], [1600, 65], [1700, 70], [1800, 70], [1850, 95], [1900, 150], [1914, 155], [1939, 150], [1941, 150], [1943, 120], [1945, 65], [1948, 60], [1950, 15], [1970, 12], [2000, 9], [2025, 7]],
    ash: [[1780, 0], [1800, 2], [1850, 10], [1900, 35], [1939, 45], [1941, 45], [1945, 10], [1950, 5], [2025, 3]]
  });
  reg('italy', 'Italy', 42.2, 12.6, {
    med: [[-160, 0], [-100, 5], [1, 50], [66, 100], [300, 60], [650, 15], [1000, 30], [1170, 40], [1300, 50], [1490, 70], [1493, 40], [1500, 35], [1600, 15], [1700, 15], [1800, 17], [1900, 20], [1939, 24], [1943, 22], [1945, 15], [1970, 16], [2025, 14]],
    sef: [[1492, 0], [1493, 9], [1500, 10], [1600, 9], [1700, 9], [1800, 10], [1900, 12], [1939, 14], [1945, 9], [1970, 10], [2025, 8]],
    ash: [[1300, 0], [1400, 3], [1500, 5], [1600, 6], [1800, 7], [1900, 8], [1939, 9], [1945, 5], [1970, 6], [2025, 5]]
  });
  reg('iberia', 'Spain & Portugal', 39.6, -4.2, {
    med: [[50, 0], [100, 3], [300, 20], [650, 20], [750, 10], [850, 0]],
    sef: [[711, 0], [750, 12], [850, 35], [1000, 60], [1170, 100], [1300, 180], [1390, 250], [1392, 200], [1400, 190], [1491, 250], [1493, 80], [1496, 80], [1498, 0], [1870, 0], [1900, 1], [1939, 6], [1970, 9], [2000, 12.5], [2025, 16]]
  });
  reg('france', 'France', 47.0, 2.6, {
    med: [[200, 0], [300, 2], [650, 3], [900, 4], [1000, 0]],
    ash: [[880, 0], [900, 2], [1000, 8], [1100, 20], [1200, 40], [1300, 60], [1305, 60], [1307, 3], [1330, 10], [1394, 6], [1396, 3], [1500, 3], [1600, 4], [1700, 8], [1800, 32], [1850, 62], [1880, 72], [1900, 100], [1914, 135], [1939, 290], [1941, 285], [1945, 160], [1950, 205], [1960, 230], [1970, 230], [1980, 225], [1990, 215], [2000, 200], [2010, 185], [2025, 165]],
    sef: [[900, 0], [1000, 5], [1200, 20], [1300, 30], [1310, 14], [1400, 10], [1500, 4], [1502, 3], [1600, 3], [1700, 5], [1800, 8], [1850, 12], [1900, 12], [1939, 30], [1945, 20], [1960, 30], [1970, 30], [2000, 30], [2025, 25]],
    mag: [[1945, 0], [1950, 10], [1956, 30], [1960, 100], [1963, 220], [1970, 270], [1980, 280], [1990, 285], [2000, 270], [2010, 269], [2025, 250]]
  });

  /* ---------- Ashkenaz and its daughters ---------- */
  reg('germany', 'Rhineland / Germany', 50.6, 9.3, {
    med: [[250, 0], [321, 1], [900, 2], [1000, 0]],
    ash: [[880, 0], [900, 1], [1000, 4], [1095, 20], [1097, 16], [1200, 25], [1300, 40], [1348, 42], [1351, 18], [1400, 22], [1500, 25], [1600, 35], [1700, 60], [1800, 170], [1850, 330], [1880, 500], [1900, 550], [1914, 570], [1925, 564], [1933, 505], [1939, 215], [1941, 165], [1943, 30], [1945, 20], [1950, 30], [1970, 30], [1990, 30], [2000, 92], [2010, 119], [2025, 125]]
  });
  reg('uk', 'England / Britain', 52.2, -1.2, {
    ash: [[1066, 0], [1100, 2], [1200, 5], [1289, 3], [1291, 0], [1680, 0], [1700, 0.5], [1800, 20], [1850, 32], [1880, 57], [1900, 245], [1914, 295], [1939, 338], [1945, 345], [1950, 412], [1970, 382], [1990, 306], [2000, 288], [2010, 282], [2025, 300]],
    sef: [[1655, 0], [1660, 0.2], [1700, 1], [1800, 3], [1900, 5], [1950, 8], [2000, 9], [2025, 12]]
  });
  reg('benelux', 'Netherlands & Belgium', 52.0, 4.8, {
    sef: [[1590, 0], [1610, 1], [1650, 3], [1700, 4], [1800, 4.5], [1900, 6], [1939, 5], [1941, 5], [1945, 1], [2025, 2]],
    ash: [[1620, 0], [1650, 2], [1700, 7], [1800, 47], [1850, 65], [1900, 110], [1939, 195], [1941, 190], [1944, 70], [1945, 59], [1950, 61], [2000, 58], [2025, 57]]
  });
  reg('bohemia', 'Bohemia, Moravia & Austria', 49.2, 15.6, {
    ash: [[950, 0], [1000, 1], [1100, 2], [1300, 12], [1400, 15], [1500, 15], [1600, 25], [1700, 55], [1800, 75], [1850, 120], [1880, 220], [1900, 306], [1914, 340], [1925, 340], [1937, 310], [1939, 160], [1941, 140], [1943, 40], [1945, 30], [1950, 25], [1970, 17], [2000, 12], [2025, 14]]
  });
  reg('hungary', 'Hungary & Slovakia', 47.6, 19.6, {
    ash: [[1050, 0], [1100, 1], [1300, 3], [1500, 8], [1600, 6], [1700, 10], [1800, 100], [1850, 280], [1880, 500], [1900, 640], [1914, 700], [1925, 700], [1939, 684], [1941, 680], [1944, 560], [1945, 235], [1950, 165], [1960, 100], [1970, 75], [1990, 60], [2000, 52], [2025, 49]]
  });
  reg('poland', 'Poland', 51.8, 20.6, {
    ash: [[1050, 0], [1100, 0.2], [1200, 0.5], [1264, 1], [1300, 2], [1350, 4], [1400, 6], [1500, 20], [1550, 50], [1600, 100], [1648, 170], [1660, 150], [1700, 200], [1764, 430], [1800, 700], [1850, 1350], [1880, 2100], [1900, 2870], [1914, 3100], [1921, 2850], [1931, 3114], [1939, 3300], [1941, 3150], [1942, 2800], [1943, 700], [1944, 350], [1945, 80], [1946, 220], [1948, 100], [1950, 45], [1960, 30], [1967, 25], [1970, 9], [1990, 4], [2025, 4.5]]
  });
  reg('lita', 'Lithuania, Latvia & Belarus', 54.6, 26.6, {
    ash: [[1350, 0], [1388, 0.5], [1400, 1], [1495, 6], [1500, 5], [1600, 25], [1648, 50], [1660, 40], [1700, 70], [1764, 150], [1800, 220], [1850, 450], [1880, 800], [1900, 1000], [1914, 1000], [1925, 660], [1939, 630], [1941, 640], [1942, 330], [1945, 190], [1959, 217], [1970, 214], [1979, 190], [1989, 152], [1995, 60], [2000, 39], [2010, 22], [2025, 15]]
  });
  reg('ukraine', 'Ukraine', 49.3, 31.0, {
    ash: [[900, 0], [930, 0.3], [1100, 1], [1240, 0.3], [1400, 1], [1500, 4], [1600, 35], [1648, 80], [1660, 40], [1700, 80], [1764, 170], [1800, 300], [1850, 750], [1880, 1350], [1900, 1680], [1914, 1800], [1921, 1500], [1926, 1574], [1939, 1533], [1941, 1550], [1942, 1050], [1945, 780], [1959, 840], [1970, 777], [1979, 634], [1989, 487], [1995, 220], [2000, 100], [2010, 71], [2020, 45], [2025, 32]]
  });
  reg('romania', 'Romania & Moldova', 46.2, 26.4, {
    ash: [[1500, 0], [1600, 2], [1700, 8], [1800, 45], [1850, 250], [1880, 550], [1900, 770], [1914, 800], [1925, 770], [1939, 760], [1941, 750], [1945, 480], [1950, 370], [1956, 240], [1966, 140], [1977, 115], [1989, 85], [1995, 30], [2000, 15], [2025, 10.5]]
  });
  reg('russia', 'Russia', 56.0, 38.5, {
    ash: [[1790, 0], [1850, 15], [1880, 70], [1900, 200], [1914, 250], [1926, 590], [1939, 950], [1941, 960], [1945, 850], [1959, 875], [1970, 808], [1979, 701], [1989, 550], [1995, 380], [2000, 290], [2010, 205], [2020, 155], [2025, 125]]
  });

  /* ---------- New worlds ---------- */
  const usTot = [[1654, 0.02], [1700, 0.3], [1776, 2], [1820, 3], [1850, 50], [1880, 250], [1900, 1058], [1914, 2930], [1925, 4200], [1939, 4800], [1945, 5000], [1950, 5000], [1960, 5500], [1970, 5400], [1980, 5650], [1990, 5515], [2000, 5600], [2010, 5800], [2020, 6000], [2025, 6300]];
  reg('usa', 'United States', 39.5, -83.0, split(usTot, {
    sef: [[1654, 100], [1776, 60], [1820, 40], [1850, 8], [1900, 1], [1925, 1.2], [1950, 1.6], [2000, 2.8], [2025, 3.2]],
    ash: [[1654, 0], [1776, 40], [1820, 60], [1850, 92], [1900, 99], [1925, 98.8], [1950, 98.2], [1980, 96], [2000, 94], [2025, 92.8]],
    miz: [[1950, 0.2], [1980, 1.2], [2000, 3.2], [2025, 4]]
  }));
  reg('canada', 'Canada', 48.5, -72.0, {
    ash: [[1760, 0], [1850, 0.5], [1900, 16], [1914, 100], [1925, 130], [1939, 168], [1950, 200], [1960, 251], [1970, 271], [1990, 285], [2000, 336], [2010, 346], [2025, 370]],
    mag: [[1955, 0], [1960, 3], [1970, 15], [1990, 25], [2000, 28], [2025, 30]]
  });
  reg('mexcar', 'Mexico & the Caribbean', 16.5, -84.0, {
    sef: [[1640, 0], [1650, 0.5], [1700, 4], [1800, 6], [1850, 5], [1900, 5], [1925, 15], [1950, 35], [1970, 45], [2000, 40], [2025, 36]],
    ash: [[1890, 0], [1900, 1], [1925, 15], [1939, 30], [1950, 45], [1960, 55], [1970, 50], [2000, 45], [2025, 36]]
  });
  reg('brazil', 'Brazil', -22.5, -45.5, {
    sef: [[1629, 0], [1645, 1.5], [1654, 0.02], [1800, 0.05], [1850, 0.5], [1900, 2], [1939, 12], [1960, 25], [2000, 24], [2025, 22]],
    ash: [[1880, 0], [1900, 1], [1914, 5], [1925, 22], [1939, 43], [1950, 55], [1960, 75], [1980, 76], [2000, 73], [2025, 68]]
  });
  reg('cone', 'Argentina, Uruguay & Chile', -34.4, -60.0, {
    ash: [[1860, 0], [1890, 2], [1900, 15], [1914, 102], [1925, 187], [1939, 280], [1950, 340], [1960, 332], [1970, 298], [1980, 255], [1990, 221], [2000, 200], [2010, 184], [2025, 172]],
    sef: [[1880, 0], [1900, 2], [1914, 18], [1925, 33], [1939, 50], [1950, 60], [1960, 58], [1970, 52], [1980, 45], [1990, 39], [2000, 35], [2010, 33], [2025, 31]]
  });
  reg('australia', 'Australia & New Zealand', -34.5, 148.5, {
    ash: [[1788, 0], [1800, 0.05], [1850, 2], [1880, 10], [1900, 16], [1939, 27], [1950, 50], [1960, 65], [1970, 70], [1990, 90], [2000, 102], [2010, 112], [2025, 124]]
  });

  /* ---------- Story ---------- */
  /* cam = [lonWest, lonEast, latSouth, latNorth] */
  const CHAPTERS = [
    { id: 'kingdoms', y0: -1000, y1: -722, cam: [29, 41, 28.5, 36], title: 'Two small kingdoms',
      text: 'The map opens around 1000 BCE in the hill country between the Jordan and the sea. At their height in the 700s BCE, the kingdoms of Israel and Judah together held perhaps 400,000 to 450,000 people. Every circle that appears later traces part of its ancestry back to this one.' },
    { id: 'exile', y0: -722, y1: -539, cam: [27, 53, 26, 39], title: 'Exile to Babylon',
      text: 'Assyria destroys the northern kingdom in 722 BCE. Babylon takes Jerusalem in 586 BCE and deports its elite to Mesopotamia. Many never return. Their community lasts 2,500 years and becomes the Jews of Iraq and Iran. Geneticists date the split of those two groups from other Jews to about this moment.' },
    { id: 'hellas', y0: -539, y1: 66, cam: [-8, 58, 23, 47], title: 'A Mediterranean people',
      text: 'Under Persia, Greece and Rome, Jews settle along the trade routes: Alexandria, Antioch, Asia Minor, Rome. One widely cited estimate puts the first-century total near 5 million, half of it outside Judea. Other scholars think the true figure was far lower. Treat these big circles as an upper bound.' },
    { id: 'revolts', y0: 66, y1: 136, cam: [8, 52, 24, 44], title: 'Rome breaks Judea',
      text: 'Three failed revolts in seventy years. The Temple burns in 70 CE. The diaspora revolt of 115 to 117 ends the great communities of Egypt and Cyrenaica. After Bar Kokhba falls in 135, much of Judea is emptied and the center of Jewish life moves to the Galilee and to Babylonia.' },
    { id: 'shrink', y0: 136, y1: 650, cam: [-10, 62, 12, 48], title: 'The great shrinking',
      text: 'Between the first and seventh centuries the Jewish world shrinks from about 5 million to about 1.2 million. War and plague explain roughly half of the loss. Economists Botticini and Eckstein argue that much of the rest left quietly, converting instead of paying for the schooling that rabbinic Judaism now required. Babylonia becomes the center, with about three in four of the world’s Jews.' },
    { id: 'islam', y0: 650, y1: 1096, cam: [-12, 66, 12, 54], title: 'One empire, two roads',
      text: 'The Arab conquests put most of the world’s Jews under a single rule. Some follow the conquest west across North Africa into Spain, which they call Sepharad. A much smaller group moves north from Italy and France to the Rhine, which they call Ashkenaz. By 1000 the two families exist. Ashkenaz is a rounding error, a few percent of all Jews.' },
    { id: 'bottleneck', y0: 1096, y1: 1391, cam: [-11, 40, 34, 58], title: 'The bottleneck',
      text: 'Ashkenaz stays small and is hit again and again: the Crusade massacres of 1096, expulsion from England in 1290 and from France in 1306, the Black Death pogroms of 1348. In their DNA, today’s Ashkenazi Jews look like the descendants of only about 350 people. Bones from a 14th-century cemetery in Erfurt show that this squeeze had already happened by then.' },
    { id: 'sepharad', y0: 1391, y1: 1520, cam: [-12, 46, 28, 54], title: '1492',
      text: 'Spain’s Jews, the largest community in Europe, must convert or leave. The exiles carry their Spanish to Salonika, Istanbul, Fez and later Amsterdam. In the Ottoman lands they absorb many of the older local communities, and “Sephardi” becomes the name for half the Jewish world. The world total falls below one million, its lowest since antiquity.' },
    { id: 'boom', y0: 1520, y1: 1880, cam: [-12, 50, 30, 62], title: 'The eastern boom',
      text: 'A few tens of thousands of Jews in Poland-Lithuania around 1500 become 750,000 by the census of 1764 and more than five million under the tsars by 1897. Even the massacres of 1648 are only a dent in the curve. Nobody has fully explained the growth. Early marriage, lower child mortality and a secure economic role on the noble estates are the usual candidates.' },
    { id: 'ocean', y0: 1880, y1: 1939, cam: [-100, 52, 12, 62], title: 'Crossing the ocean',
      text: 'Pogroms and poverty push more than two million Jews out of the Russian Empire between 1881 and 1924. Most land in New York. Others go to Buenos Aires, Johannesburg, London and Jaffa. In 1939 the world Jewish population reaches its all-time peak, about 16.6 million. About nine in ten are Ashkenazi.' },
    { id: 'shoah', y0: 1939, y1: 1945, cam: [-6, 46, 36, 60], title: 'The Shoah',
      text: 'In six years Germany and its collaborators murder about six million Jews, two of every three in Europe. The circle over Poland, 3.3 million people, almost disappears. Sephardi Salonika is destroyed. The world total falls to 11 million.' },
    { id: 'ingather', y0: 1945, y1: 1989, cam: [-20, 62, 8, 58], title: 'Ingathering',
      text: 'Israel is founded in 1948. Within three years nearly all the Jews of Iraq, Yemen and Libya arrive. Morocco, Tunisia, Algeria, Egypt and later Iran follow, to Israel and to France. About 850,000 Jews leave the Arab and Muslim world. Communities 2,500 years old vanish from the map in a decade.' },
    { id: 'today', y0: 1989, y1: 2025, cam: [-128, 156, -42, 66], title: 'Two centers',
      text: 'After 1989 about a million Soviet Jews leave, most for Israel. Ethiopian Jews are airlifted out in 1984 and 1991. Today there are about 15.8 million Jews, still fewer than in 1939. About 46% live in Israel and 40% in the United States. In Israel the old communities are marrying each other, and the colors on this map are starting to blur.' }
  ];

  const EVENTS = [
    { y: -722, lat: 32.28, lon: 35.19, t: 'Samaria falls to Assyria' },
    { y: -586, lat: 31.78, lon: 35.22, t: 'Jerusalem falls to Babylon' },
    { y: -539, lat: 32.5, lon: 44.4, t: 'Cyrus allows the return' },
    { y: -331, lat: 31.2, lon: 29.9, t: 'Alexandria founded' },
    { y: 70, lat: 31.78, lon: 35.22, t: 'The Temple is destroyed' },
    { y: 117, lat: 31.2, lon: 29.9, t: 'Diaspora revolt crushed' },
    { y: 135, lat: 31.73, lon: 35.13, t: 'Bar Kokhba defeated' },
    { y: 500, lat: 32.0, lon: 44.4, t: 'Babylonian Talmud takes shape' },
    { y: 711, lat: 37.9, lon: -4.8, t: 'Muslim conquest of Spain' },
    { y: 1096, lat: 50.0, lon: 8.27, t: 'Rhineland massacres' },
    { y: 1258, lat: 33.3, lon: 44.4, t: 'Mongols sack Baghdad' },
    { y: 1290, lat: 51.5, lon: -0.1, t: 'England expels its Jews' },
    { y: 1306, lat: 48.86, lon: 2.35, t: 'France expels its Jews' },
    { y: 1348, lat: 48.58, lon: 7.75, t: 'Black Death pogroms' },
    { y: 1492, lat: 39.86, lon: -4.03, t: 'Spain expels its Jews' },
    { y: 1648, lat: 49.0, lon: 31.0, t: 'Khmelnytsky uprising' },
    { y: 1881, lat: 48.5, lon: 32.3, t: 'Pogroms, and the exodus begins' },
    { y: 1942, lat: 52.63, lon: 22.05, t: 'The death camps' },
    { y: 1948, lat: 32.08, lon: 34.78, t: 'State of Israel declared' },
    { y: 1950, lat: 33.3, lon: 44.4, t: 'Iraq’s Jews airlifted out' },
    { y: 1962, lat: 36.75, lon: 3.06, t: 'Algeria’s Jews leave for France' },
    { y: 1990, lat: 55.75, lon: 37.6, t: 'The Soviet gates open' },
    { y: 1991, lat: 9.0, lon: 38.75, t: 'Operation Solomon' }
  ];

  /* migration arcs: [fromRegion, toRegion, startYear, endYear, group] */
  const FLOWS = [
    ['israel', 'iraq', -597, -575, 'isr'], ['israel', 'egypt', -586, -560, 'isr'], ['iraq', 'israel', -538, -440, 'isr'],
    ['iraq', 'iran', -500, -300, 'miz'],
    ['israel', 'egypt', -310, -100, 'med'], ['israel', 'syria', -250, 0, 'isr'], ['syria', 'turkey', -210, 0, 'med'], ['turkey', 'balkans', -150, 50, 'med'],
    ['israel', 'italy', -63, 140, 'med'], ['egypt', 'libya', -300, -100, 'med'],
    ['israel', 'iraq', 70, 250, 'isr'], ['israel', 'yemen', 100, 400, 'yem'], ['italy', 'iberia', 50, 300, 'med'],
    ['iraq', 'casia', 400, 900, 'miz'],
    ['egypt', 'tunisia', 650, 900, 'mag'], ['tunisia', 'morocco', 700, 1000, 'mag'], ['morocco', 'iberia', 711, 950, 'sef'], ['iraq', 'iberia', 800, 1000, 'sef'],
    ['italy', 'germany', 800, 1000, 'ash'], ['france', 'germany', 900, 1100, 'ash'], ['france', 'uk', 1066, 1150, 'ash'],
    ['uk', 'france', 1289, 1292, 'ash'], ['france', 'germany', 1305, 1325, 'ash'], ['france', 'iberia', 1305, 1325, 'sef'],
    ['germany', 'poland', 1250, 1520, 'ash'], ['germany', 'bohemia', 1100, 1400, 'ash'], ['germany', 'italy', 1348, 1450, 'ash'],
    ['poland', 'lita', 1388, 1600, 'ash'], ['poland', 'ukraine', 1500, 1648, 'ash'],
    ['iberia', 'algeria', 1391, 1396, 'sef'], ['iberia', 'morocco', 1492, 1500, 'sef'], ['iberia', 'turkey', 1492, 1540, 'sef'], ['iberia', 'balkans', 1492, 1540, 'sef'], ['iberia', 'italy', 1492, 1530, 'sef'],
    ['balkans', 'israel', 1500, 1570, 'sef'], ['turkey', 'syria', 1500, 1600, 'sef'], ['turkey', 'egypt', 1517, 1600, 'sef'],
    ['iberia', 'benelux', 1590, 1680, 'sef'], ['benelux', 'brazil', 1630, 1650, 'sef'], ['brazil', 'mexcar', 1654, 1670, 'sef'], ['brazil', 'usa', 1654, 1660, 'sef'], ['benelux', 'uk', 1655, 1700, 'sef'],
    ['ukraine', 'benelux', 1648, 1680, 'ash'], ['germany', 'benelux', 1620, 1750, 'ash'], ['bohemia', 'hungary', 1700, 1850, 'ash'], ['poland', 'romania', 1780, 1880, 'ash'], ['poland', 'hungary', 1780, 1880, 'ash'],
    ['germany', 'usa', 1836, 1880, 'ash'],
    ['poland', 'usa', 1881, 1924, 'ash'], ['lita', 'usa', 1881, 1924, 'ash'], ['ukraine', 'usa', 1881, 1924, 'ash'], ['romania', 'usa', 1881, 1924, 'ash'], ['hungary', 'usa', 1881, 1914, 'ash'],
    ['lita', 'safrica', 1881, 1930, 'ash'], ['ukraine', 'cone', 1889, 1935, 'ash'], ['poland', 'uk', 1881, 1914, 'ash'], ['romania', 'canada', 1890, 1930, 'ash'],
    ['ukraine', 'israel', 1882, 1914, 'ash'], ['poland', 'israel', 1919, 1939, 'ash'], ['yemen', 'israel', 1881, 1914, 'yem'], ['lita', 'russia', 1915, 1939, 'ash'], ['ukraine', 'russia', 1915, 1939, 'ash'],
    ['balkans', 'usa', 1900, 1924, 'sef'], ['turkey', 'cone', 1900, 1930, 'sef'], ['syria', 'mexcar', 1900, 1930, 'sef'],
    ['germany', 'usa', 1933, 1941, 'ash'], ['germany', 'uk', 1933, 1939, 'ash'], ['germany', 'israel', 1933, 1939, 'ash'], ['bohemia', 'uk', 1938, 1939, 'ash'],
    ['ukraine', 'casia', 1941, 1942, 'ash'], ['poland', 'russia', 1939, 1941, 'ash'],
    ['germany', 'israel', 1945, 1951, 'ash'], ['germany', 'usa', 1946, 1952, 'ash'], ['romania', 'israel', 1948, 1966, 'ash'], ['poland', 'israel', 1946, 1958, 'ash'], ['hungary', 'israel', 1948, 1957, 'ash'], ['balkans', 'israel', 1948, 1950, 'sef'], ['turkey', 'israel', 1948, 1950, 'sef'],
    ['yemen', 'israel', 1949, 1951, 'yem'], ['iraq', 'israel', 1950, 1952, 'miz'], ['libya', 'israel', 1948, 1952, 'mag'], ['iran', 'israel', 1948, 1955, 'miz'], ['egypt', 'israel', 1948, 1958, 'sef'], ['india', 'israel', 1949, 1970, 'ind'],
    ['morocco', 'israel', 1948, 1967, 'mag'], ['tunisia', 'israel', 1948, 1967, 'mag'], ['morocco', 'france', 1956, 1970, 'mag'], ['tunisia', 'france', 1956, 1968, 'mag'], ['algeria', 'france', 1960, 1963, 'mag'], ['egypt', 'france', 1956, 1958, 'sef'], ['morocco', 'canada', 1957, 1975, 'mag'],
    ['iran', 'usa', 1978, 1987, 'miz'], ['russia', 'israel', 1969, 1980, 'ash'], ['ukraine', 'usa', 1973, 1981, 'ash'],
    ['russia', 'israel', 1989, 2000, 'ash'], ['ukraine', 'israel', 1989, 2000, 'ash'], ['lita', 'israel', 1989, 1998, 'ash'], ['ukraine', 'usa', 1988, 1998, 'ash'], ['russia', 'germany', 1991, 2005, 'ash'], ['casia', 'israel', 1989, 1998, 'miz'], ['caucasus', 'israel', 1989, 1998, 'miz'], ['casia', 'usa', 1989, 1998, 'miz'],
    ['ethiopia', 'israel', 1984, 1986, 'eth'], ['ethiopia', 'israel', 1990, 1992, 'eth'], ['ethiopia', 'israel', 1997, 2012, 'eth'],
    ['safrica', 'australia', 1977, 2005, 'ash'], ['cone', 'israel', 1976, 2003, 'ash'], ['france', 'israel', 2000, 2018, 'mag'], ['ukraine', 'israel', 2022, 2024, 'ash'], ['russia', 'israel', 2022, 2024, 'ash']
  ];

  /* timeline warp: [year, position 0..1]. Dense eras get more room, so playback slows there. */
  const WARP = [[-1000, 0], [-600, 0.07], [-330, 0.11], [1, 0.17], [136, 0.225], [650, 0.28], [1000, 0.33], [1492, 0.455], [1800, 0.565], [1880, 0.64], [1939, 0.755], [1945, 0.815], [1952, 0.865], [2025, 1]];

  return { GROUPS, REGIONS: R, CHAPTERS, EVENTS, FLOWS, WARP, Y0: -1000, Y1: 2025 };
})();
if (typeof module !== 'undefined') module.exports = ATLAS;

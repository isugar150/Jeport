var Jeport = function (el, options) {
  this.el = el;
  this.options = options;

  if (!el) {
    console.error("Element is required for Jeport");
    return;
  }

  const defaultOptions = {
    showPageNumbers: true,
    watermark: {
      enabled: false,
      image: undefined,
    },
  };

  const settings = { ...defaultOptions, ...options };

  var printContent;

  let pageHeight = 297;

  this.init = function (callback) {
    printContent = document.createElement("div");
    printContent.className = "print-content";
    printContent.style.height = "auto";
    el.parentNode.appendChild(printContent);

    printContent.innerHTML = "";
    let currentPage = createPage();
    printContent.appendChild(currentPage);
    pageHeight = currentPage.clientHeight;

    processContent(el, currentPage);

    if (settings.showPageNumbers) {
      addPageNumbers();
    }

    el.style.display = "none";
    printContent.style.display = "block";

    callback();

    return this;
  };

  function createPage(isFirstPage = false) {
    const page = document.createElement("div");
    page.className = "page";

    if (!isFirstPage) {
      page.style.padding = "20mm";
    }

    if (settings.watermark.enabled && settings.watermark.image) {
      const watermark = document.createElement("div");
      watermark.className = "watermark";
      const img = document.createElement("img");
      img.src = settings.watermark.image;
      watermark.appendChild(img);
      page.appendChild(watermark);
    }

    return page;
  }

  function addPageNumbers() {
    const pages = printContent.getElementsByClassName("page");
    const totalPages = pages.length;

    for (let i = 0; i < totalPages; i++) {
      const pageNumberDiv = document.createElement("div");
      pageNumberDiv.className = "page-number";
      pageNumberDiv.textContent = `${i + 1}/${totalPages}`;
      pages[i].appendChild(pageNumberDiv);
    }
  }

  function processContent(element, currentPage) {
    for (let child of element.childNodes) {
      if (
        child.nodeType === Node.ELEMENT_NODE ||
        (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "")
      ) {
        currentPage = addContentToPage(child, currentPage);
      }
    }

    const pages = printContent.getElementsByClassName("page");
    for (let i = pages.length - 1; i >= 0; i--) {
      const pageContent = pages[i].textContent.trim();
      const hasImage = pages[i].querySelector("img:not(.watermark img)");
      const hasOnlyWatermarkAndPageNumber =
        !hasImage &&
        pageContent ===
          (pages[i].querySelector(".page-number")?.textContent || "").trim();

      if (pageContent === "" || hasOnlyWatermarkAndPageNumber) {
        printContent.removeChild(pages[i]);
      }
    }
  }

  function addContentToPage(element, currentPage) {
    const clone = element.cloneNode(true);
    currentPage.appendChild(clone);

    if (currentPage.scrollHeight > pageHeight - 10) {
      currentPage.removeChild(clone);
      const nextPage = createPage();
      printContent.appendChild(nextPage);

      if (element.nodeType === Node.TEXT_NODE) {
        return splitTextNode(element, currentPage, nextPage);
      } else if (element.tagName === "TABLE") {
        return splitTableNode(element, currentPage, nextPage);
      } else {
        return splitElementNode(element, currentPage, nextPage);
      }
    }

    return currentPage;
  }

  function addContentToPage(element, currentPage) {
    const clone = element.cloneNode(true);
    currentPage.appendChild(clone);

    if (currentPage.scrollHeight > pageHeight) {
      currentPage.removeChild(clone);
      const nextPage = createPage();
      printContent.appendChild(nextPage);

      if (element.nodeType === Node.TEXT_NODE) {
        return splitTextNode(element, currentPage, nextPage);
      } else if (element.tagName === "TABLE") {
        return splitTableNode(element, currentPage, nextPage);
      } else {
        return splitElementNode(element, currentPage, nextPage);
      }
    }

    return currentPage;
  }

  function splitTableNode(table, currentPage, nextPage) {
    const clone = table.cloneNode(true);
    const thead = clone.querySelector("thead");
    const tbody = clone.querySelector("tbody");

    if (!thead || !tbody) {
      return splitElementNode(table, currentPage, nextPage);
    }

    let currentTable = clone.cloneNode(false);
    let isFirstPage = true;
    let currentTbody = document.createElement("tbody");
    currentTable.appendChild(currentTbody);
    currentPage.appendChild(currentTable);

    const rows = Array.from(tbody.rows);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].cloneNode(true);

      if (isFirstPage && i === 0) {
        currentTable.insertBefore(thead.cloneNode(true), currentTbody);
      }

      currentTbody.appendChild(row);

      if (currentPage.scrollHeight > pageHeight) {
        currentTbody.removeChild(row);

        if (currentTbody.rows.length === 0) {
          currentPage.removeChild(currentTable);
        }

        nextPage = createPage();
        printContent.appendChild(nextPage);
        currentPage = nextPage;

        currentTable = clone.cloneNode(false);
        currentTbody = document.createElement("tbody");
        currentTable.appendChild(currentTbody);
        currentPage.appendChild(currentTable);

        isFirstPage = false;
        i--;
      }
    }

    return currentPage;
  }

  function splitTextNode(textNode, currentPage, nextPage) {
    const lines = textNode.textContent.split("\n");
    let currentText = "";
    let remainingText = "";

    for (let i = 0; i < lines.length; i++) {
      const testText = currentText + lines[i] + "\n";
      const tempSpan = document.createElement("span");
      tempSpan.textContent = testText;
      currentPage.appendChild(tempSpan);

      if (currentPage.scrollHeight <= pageHeight) {
        currentText = testText;
        currentPage.removeChild(tempSpan);
      } else {
        remainingText = lines.slice(i).join("\n");
        currentPage.removeChild(tempSpan);
        break;
      }
    }

    if (currentText) {
      currentPage.appendChild(document.createTextNode(currentText.trim()));
    }
    if (remainingText) {
      nextPage.appendChild(document.createTextNode(remainingText.trim()));
      return nextPage;
    }

    return currentPage;
  }

  function splitElementNode(element, currentPage, nextPage) {
    const clone = element.cloneNode(false);
    currentPage.appendChild(clone);

    let currentPageToUse = currentPage;

    for (let child of element.childNodes) {
      if (currentPageToUse.scrollHeight > pageHeight) {
        currentPageToUse = addContentToPage(child, nextPage);
      } else {
        currentPageToUse = addContentToPage(child, currentPageToUse);
      }
    }

    if (nextPage && nextPage.textContent.trim() === "") {
      printContent.removeChild(nextPage);
      return currentPage;
    }

    return currentPageToUse;
  }

  this.print = function () {
    setTimeout(function () {
      window.print();
    }, 250);
    return this;
  };
};

window.onload = function () {
  const header = document.getElementsByTagName("header")[0];
  if (header) {
    const body = document.getElementsByTagName("body")[0];
    body.style.marginTop = `${header.clientHeight}px`;
  }
};

window.onbeforeprint = function () {
  var style = document.createElement("style");
  style.innerHTML = "@page { size: auto; margin: 0mm; }";
  document.head.appendChild(style);
};

window.onafterprint = function () {
  const pages = document.getElementsByClassName("page");
  if (pages.length > 0) {
    const lastPage = pages[pages.length - 1];
    if (lastPage.offsetHeight < 10) {
      lastPage.remove();
    }
  }
};

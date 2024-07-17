var Jeport = function (el, options) {
  this.el = el;
  this.options = options;

  if (!el) {
    console.error("Element is required for Jeport");
    return;
  }

  const defaultOptions = {
    showPageNumbers: false,
    watermark: {
      enabled: false,
      image: undefined,
    },
  };

  const settings = { ...defaultOptions, ...options };

  var printContent;

  let pageHeight = 297;

  function isPageEmpty(page) {
    const scriptsAndStyles = page.querySelectorAll("script, style");
    if (scriptsAndStyles.length > 0) {
      return true;
    }

    const contentWithoutWatermarkAndPageNumber = Array.from(page.children)
      .filter(
        (child) =>
          !child.classList.contains("_jeport_watermark") &&
          !child.classList.contains("_jeport_page-number")
      )
      .map((child) => child.textContent)
      .join("")
      .trim();

    if (contentWithoutWatermarkAndPageNumber !== "") {
      return false;
    }

    const meaningfulElements = Array.from(
      page.querySelectorAll(
        "img:not(._jeport_watermark img), svg, canvas, table"
      )
    );
    if (meaningfulElements.length > 0) {
      return false;
    }

    return true;
  }

  function isElementEmpty(element) {
    if (
      element.classList.contains("_jeport_watermark") ||
      element.classList.contains("_jeport_page-number")
    ) {
      return true;
    }

    const tagName = element.tagName.toLowerCase();
    if (tagName === "script" || tagName === "style") {
      return true;
    }

    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
        return false;
      }
    }

    if (
      element.tagName === "IMG" &&
      element.src &&
      !element.closest("._jeport_watermark")
    ) {
      return false;
    }

    for (let child of element.children) {
      if (!isElementEmpty(child)) {
        return false;
      }
    }

    return true;
  }

  function isElementEmpty(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "script" || tagName === "style") {
      return true;
    }

    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
        return false;
      }
    }

    if (element.tagName === "IMG" && element.src) {
      return false;
    }

    for (let child of element.children) {
      if (!isElementEmpty(child)) {
        return false;
      }
    }

    return true;
  }

  this.init = function (callback) {
    printContent = document.createElement("div");
    printContent.className = "_jeport_print-content";
    printContent.style.height = "auto";
    el.parentNode.appendChild(printContent);

    printContent.innerHTML = "";
    let currentPage = createPage();
    printContent.appendChild(currentPage);
    pageHeight = currentPage.clientHeight;
    currentPage = processContent(el, currentPage);

    if (isPageEmpty(currentPage) && currentPage.parentNode === printContent) {
      printContent.removeChild(currentPage);
    }

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
    page.className = "_jeport_page";

    if (!isFirstPage) {
      page.style.padding = "20mm";
    }

    if (settings.watermark.enabled && settings.watermark.image) {
      const watermark = document.createElement("div");
      watermark.className = "_jeport_watermark";
      const img = document.createElement("img");
      img.src = settings.watermark.image;
      watermark.appendChild(img);
      page.appendChild(watermark);
    }

    return page;
  }

  function addPageNumbers() {
    const pages = printContent.getElementsByClassName("_jeport_page");
    const totalPages = pages.length;

    for (let i = 0; i < totalPages; i++) {
      const pageNumberDiv = document.createElement("div");
      pageNumberDiv.className = "_jeport_page-number";
      pageNumberDiv.textContent = `${i + 1}/${totalPages}`;
      pages[i].appendChild(pageNumberDiv);
    }
  }

  function processContent(element, currentPage) {
    if (element.nodeType === Node.ELEMENT_NODE && element.tagName === "TABLE") {
      return processTable(element, currentPage);
    }

    for (let child of element.childNodes) {
      if (
        child.nodeType === Node.ELEMENT_NODE ||
        (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "")
      ) {
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          child.classList.contains("_jeport_page-brake")
        ) {
          currentPage = createPage();
          printContent.appendChild(currentPage);
        } else if (
          child.nodeType === Node.ELEMENT_NODE &&
          child.tagName === "TABLE"
        ) {
          currentPage = processTable(child, currentPage);
        } else {
          currentPage = addContentToPage(child, currentPage);
        }
      }
    }

    const pages = Array.from(
      printContent.getElementsByClassName("_jeport_page")
    );
    pages.forEach((page) => {
      if (isPageEmpty(page) && page.parentNode === printContent) {
        printContent.removeChild(page);
      }
    });

    return currentPage;
  }

  function processTable(table, currentPage) {
    const clone = table.cloneNode(true);
    const colgroup = clone.querySelector("colgroup");
    const thead = clone.querySelector("thead");
    const tbody = clone.querySelector("tbody");

    if (!thead || !tbody) {
      return addContentToPage(table, currentPage);
    }

    function createTableStructure(includeHeader) {
      let newTable = document.createElement("table");
      for (let attr of table.attributes) {
        newTable.setAttribute(attr.name, attr.value);
      }
      if (colgroup) {
        newTable.appendChild(colgroup.cloneNode(true));
      }
      if (includeHeader) {
        newTable.appendChild(thead.cloneNode(true));
      }
      let newTbody = document.createElement("tbody");
      newTable.appendChild(newTbody);
      return { table: newTable, tbody: newTbody };
    }

    let { table: currentTable, tbody: currentTbody } =
      createTableStructure(true);

    // 테이블을 추가하기 전에 현재 페이지가 비어있는지 확인
    if (isPageEmpty(currentPage)) {
      currentPage.appendChild(currentTable);
    } else {
      // 현재 페이지가 이미 내용이 있다면 새 페이지를 만들어 테이블 추가
      let nextPage = createPage();
      printContent.appendChild(nextPage);
      currentPage = nextPage;
      currentPage.appendChild(currentTable);
    }

    const rows = Array.from(tbody.rows);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].cloneNode(true);
      currentTbody.appendChild(row);

      if (currentPage.scrollHeight > pageHeight) {
        currentTbody.removeChild(row);

        if (currentTbody.rows.length === 0) {
          currentPage.removeChild(currentTable);
        } else {
          let nextPage = createPage();
          printContent.appendChild(nextPage);
          currentPage = nextPage;

          ({ table: currentTable, tbody: currentTbody } =
            createTableStructure(false));
          currentPage.appendChild(currentTable);
          i--; // Retry this row in the new table
        }
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
        return processTable(element, nextPage);
      } else {
        return splitElementNode(element, currentPage, nextPage);
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

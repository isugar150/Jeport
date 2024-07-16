var Jeport = function (pageSize = EnumPaperSize.A4) {
  const content = document.getElementsByClassName("content")[0];
  const printContent = document.getElementsByClassName("print-content")[0];

  const pageWidth = pageSize.width;
  let pageHeight = pageSize.height; // const에서 let으로 변경
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  function init() {
    printContent.innerHTML = "";
    let currentPage = createPage();
    printContent.appendChild(currentPage);

    // 실제 페이지 높이를 픽셀 단위로 계산
    pageHeight = currentPage.clientHeight;

    processContent(content, currentPage);

    content.style.display = "none";
    printContent.style.display = "block";
  }

  function createPage() {
    const page = document.createElement("div");
    page.className = "page";
    return page;
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

    // 빈 페이지 제거
    const pages = printContent.getElementsByClassName("page");
    for (let i = pages.length - 1; i >= 0; i--) {
      if (pages[i].textContent.trim() === "") {
        printContent.removeChild(pages[i]);
      }
    }
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
      // 테이블에 thead나 tbody가 없는 경우 일반 요소처럼 처리
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
        // 첫 페이지의 첫 행 앞에 thead 삽입
        currentTable.insertBefore(thead.cloneNode(true), currentTbody);
      }

      currentTbody.appendChild(row);

      if (currentPage.scrollHeight > pageHeight) {
        currentTbody.removeChild(row);

        if (currentTbody.rows.length === 0) {
          // 현재 페이지에 아무 행도 들어가지 않았다면 테이블 자체를 제거
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
        i--; // 현재 행을 다시 처리
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

    // 빈 페이지 검사 및 제거
    if (nextPage && nextPage.textContent.trim() === "") {
      printContent.removeChild(nextPage);
      return currentPage;
    }

    return currentPageToUse;
  }

  function setupPrintButton() {
    const printBtn = document.getElementById("printBtn");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
      });
    }
  }

  return {
    init: init,
    setupPrintButton: setupPrintButton,
  };
};

// EnumPaperSize는 그대로 유지

window.onload = function () {
  const jeport = Jeport();
  jeport.init();
  jeport.setupPrintButton();

  const header = document.getElementsByTagName("header")[0];
  if (header) {
    const body = document.getElementsByTagName("body")[0];
    body.style.paddingTop = `${header.clientHeight}px`;
  }
};

const EnumPaperSize = {
  A0: {
    width: 2384,
    height: 3370,
  },
  A1: {
    width: 1684,
    height: 2384,
  },
  A2: {
    width: 1191,
    height: 1684,
  },
  A3: {
    width: 841,
    height: 1191,
  },
  A4: {
    width: 210, // mm
    height: 297, // mm
  },
  A5: {
    width: 420,
    height: 595,
  },
};

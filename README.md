## 소개
* 웹 기반 보고서 생성 라이브러리  
  
## 사용방법

### 사용법
``` javascript
jeport = new Jeport(document.getElementsByClassName("content")[0], { showPageNumbers: true });
jeport.init();
```

``` html
... 
<div class="content">
<!-- 여기에 출력할 내용 입력 -->
</div>
<div class="print-content"></div>
...
```

### option
| 기능 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| showPageNumbers | boolean | true | 페이지 마다 페이지 수를 표기합니다. |

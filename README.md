## 소개

- 웹 기반 보고서 생성 라이브러리
- 샘플 페이지: https://isugar150.github.io/Jeport/test/

## 사용방법

### 원리 및 사용법

- 타겟 div안에 있는 컨텐츠를 a4용지 사이즈에 맞게 재배치합니다.

```javascript
var jeport = new Jeport(document.getElementsByClassName("content")[0], {
  showPageNumbers: true,
  pagePadding: '50px 30px',
  watermark: {
    enabled: true,
    image: "./watermark.jpg",
  },
});
jeport.init(() => {
  console.log("callback");
  jeport.print();
});
```

```html
<!-- 내용 중간에 페이지를 바꾸려면 아래 div를 추가합니다. -->
<div class="_jeport_page-brake"></div>
```

### option

| depth1          | depth2  | type    | default   | explanation                                         |
| --------------- | ------- | ------- | --------- | --------------------------------------------------- |
| showPageNumbers |         | boolean | false     | 페이지 마다 페이지 수를 표기합니다.                 |
| pagePadding     |         | string  | 50px 30px | 페이지 마다 여백을 설정합니다. CSS의 padding값 입력 |
| watermark       | enabled | boolean | false     | 워터마크 사용 여부를 정합니다.                      |
| watermark       | image   | string  | undefined | 워터마크로 사용할 이미지 경로를 입력합니다.         |

## 사용 이미지

![1](https://github.com/user-attachments/assets/9d5567cf-280d-46ea-aad5-26d5e4e58ebd)

![2](https://github.com/user-attachments/assets/439d784b-4278-4c27-aeae-d8c7c421dffd)

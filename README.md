## 소개

- 웹 기반 보고서 생성 라이브러리

## 사용방법

### 사용법

```javascript
var jeport = new Jeport(document.getElementsByClassName("content")[0], {
  showPageNumbers: true,
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

### option

| depth1          | depth2  | type    | default   | explanation                                 |
| --------------- | ------- | ------- | --------- | ------------------------------------------- |
| showPageNumbers |         | boolean | true      | 페이지 마다 페이지 수를 표기합니다.         |
| watermark       | enabled | boolean | true      | 워터마크 사용 여부를 정합니다.              |
| watermark       | image   | string  | undefined | 워터마크로 사용할 이미지 경로를 입력합니다. |

## 사용 이미지

![1](https://github.com/user-attachments/assets/9d5567cf-280d-46ea-aad5-26d5e4e58ebd)

![2](https://github.com/user-attachments/assets/439d784b-4278-4c27-aeae-d8c7c421dffd)

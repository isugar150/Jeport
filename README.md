## 소개

- 웹 기반 보고서 생성 라이브러리
- 샘플 페이지: https://isugar150.github.io/Jeport/test/

## 사용방법

### 원리 및 사용법

- 타겟 div안에 있는 컨텐츠를 a4용지 사이즈에 맞게 재배치합니다.
##### Import
``` html
<script src="https://isugar150.github.io/Jeport/dist/jeport-1.0.js"></script>
<link rel="stylesheet" href="https://isugar150.github.io/Jeport/dist/jeport-1.0.css" />
```
##### Usage
```html
<script>
  var jeport = new Jeport(document.getElementsByClassName("content")[0], {
    showPageNumbers: true,
    pagePadding: "50px 30px",
    watermark: { enabled: true, image: "./watermark.jpg" },
  });
  jeport.init(() => {
    console.log("callback");
    jeport.print();
  });
</script>

<div class="content">출력할 내용</div>
```

```html
<!-- 내용 중간에 페이지를 바꾸려면 아래 div를 추가합니다. 1depth에서만 작동함 -->
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

![스크린샷 2024-07-18 오후 1 54 52](https://github.com/user-attachments/assets/bd726f77-c3ec-46e9-8a40-98266cc5b74f)
![isugar150 github io_Jeport_test_](https://github.com/user-attachments/assets/705109de-7b22-4257-ab01-a2c49e2140f4)

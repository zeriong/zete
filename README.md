# 📝 ZETE 편리한 메모서비스

   <h4>
      메모를 작성하고 "저장" 버튼을 깜빡하면 어쩌죠?<br/>
   </h4>
<blockquote>
   <p>
      걱정마세요! ZETE는 작성과 동시에 메모가 저장되어 유실 될 걱정이 없습니다!<br/>
      카테고리와 태그를 통해서 간편하게 분류하고 AI를 통해 검색한 정보를 간추려서<br/>
      메모로 즉시 반영할 수 있는 똑똑하고 편리한 메모 서비스입니다.
   </p>
</blockquote>

`💾 저장버튼 없이 즉시 저장` &nbsp; `📚 카테고리, 태그를 통한 분류 관리` &nbsp; `🤖AI(Chat GPT)가 내장된 검색 결과 메모`

<br/><br/>
<div align="center">
   <table>
      <td align="center">
         <h4>배포 버전 레포지토리 👉 <a href="https://github.com/zeriong/zete-zustand-reactQuery"> [ 바로가기 ] </a></h3>
         <h6>
            <em>
               <strong>
                  &nbsp;&nbsp;&nbsp;
                  📢 기존 코드를 다른 스택으로 컨버팅하는 과정과 배포 등의 경험이 포함되어 있습니다.
                  &nbsp;&nbsp;&nbsp;&nbsp;
               </strong>
            </em>
         </h6>
         <br/>
      </td>
   </table>
</div>

<br/>

## 🚀 프로젝트 지향점
✔️ CRUD에 대한 이해와 경험을 목표로 Frontend, Backend 개발을 진행하였습니다.<br/>
✔️ 현업에서도 사용 가능한 기술과 코드를 경험하기 위해 노력하였습니다.<br/>
✔️ 클린코드와 보다 나은 설계 구조에 다가가기 위해 여러 차례 리팩토링을 진행하였습니다.<br/>
✔️ 명확히 이해한 기술만 사용하려 노력하였고 기술 사용 전 Docs를 정독하고 있습니다.<br/>
✔️ 트래픽 증가에 따라 분산 가능한 구조로 설계하였습니다.<br/>
✔️ Openapi Codegen 등을 통하여 개발을 자동화하고 효율적으로 관리하기 위해 노력하였습니다.<br/>

<br/>

## ⚙ 사용된 기술 스택
<table border="1">
   <th align="center">CATEGORY</th>
   <th align="center" width="142px">STACK</th>
   <th align="center">ETC</th>
   <tr>
      <td rowspan="1" align="center">Common</td>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/92967b19-a554-457d-8e8d-fb5309469b04" width="15px"/>
         TypeScript
      </td>
      <td>타입을 정의하는 과정이 추가되지만 그로 인해 코드가 명확해지고 컴파일 타임에서 오류를 인지할 수 있었습니다.</td>
   </tr>
   <tr>
      <td rowspan="4" align="center">Frontend</td>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/5e468952-9d18-4907-9974-472f0fc1d22b" width="16px"/>
         React.js
      </td>
      <td>가장 대중적인 인터페이스 라이브러리인 react의 숙달을 목표로 하였습니다.</td>
   </tr>
   <tr>
      <td>
        <img src="https://d33wubrfki0l68.cloudfront.net/0834d0215db51e91525a25acf97433051f280f2f/c30f5/img/redux.svg" alt="Redux Logo" width="16px">
        Redux Toolkit<br/>
      </td>
      <td>react와 함께 사용하는 대표적인 상태관리 라이브러리인 redux를 통해 상태관리에 대한 이해와 경험을 목표로 하였고 thunk를 사용해 통신결과에 따른 상태를 관리할 수 있었습니다.</td>
   </tr>
   <tr>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/5f13fec1-4d9c-4010-b1f8-2102ede6b22a" width="15px"/>
         Openapi Generator
      </td>
      <td>
         백엔드에서 만들어진 통신 객체의 타입을 수작업으로 프론트에
         동기화 하는 것은 프로젝트가 커질수록 고통스럽고 문제가
         생길 여지가 있다고 생각되었습니다. 때문에 이를 자동화할 수 있는
         Open Generator를 도입하였고 template을 직접적으로 수정할 수 있어
         axios통신 함수를 용도에 맞게 생산하는 등 생산성에 큰 효과를 보았습니다.
      </td>
   </tr>
   <tr>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/f6e23406-cfe5-404e-b8dd-650c678bb99f" width="15px"/>
         Tailwind CSS
      </td>
      <td>css파일을 오가지 않고 className에 미리 정의된 css속성의 클래스를 사용하는 방식은 더 직관적이고 생산적이라고 느꼈습니다.</td>
   </tr>
   <tr>
      <td rowspan="5" align="center">Backend</td>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/5e6ec340-688e-44aa-8a55-27ec80f19eff" width="15px"/>
         Nest.js
      </td>
      <td>Javascript기반의 백엔드 프레임워크 중 많은 학습자료, 필요한 대부분의 기능을 잘 정리해둔 Docs, 모듈형식의 아키텍처 등 학습하기에 가장 적합한 NestJS를 선택하였습니다.</td>
   </tr>
   <tr>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/aa3db068-991b-4e2e-b428-677e10379b03" width="15px"/>
         MariaDB
      </td>
      <td>MySQL과 호환되며 오픈소스인 MariaDB를 무난하게 선택하였습니다.</td>
   </tr>
   <tr>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/ec542cc0-63d1-4432-9a8f-032598b7ee6e" width="15px"/>
         TypeORM
      </td>
      <td>NestJS에서 데이터베이스를 다루는 자연스러운 방식에 따라 사용하게 되었지만 typescript지원과 엔티티와의 맵핑, 보안문제 등 해결가능 한 것이 많은 이점이 있었습니다.</td>
   </tr>
   <tr>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/9f28e99e-f4c2-4305-96d9-182e49e3da7b" width="15px"/>
         Swagger
      </td>
      <td>API및 통신 객체 타입 등의 명세를 위해 사용하였고 더 나아가 yaml양식을 생성하여 codegen에 활용하였습니다.</td>
   </tr>
   <tr>
      <td>
         <img src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/6b103b83-6ef2-4482-8d33-c968a5f56514" width="15px"/>
         JWT Token
      </td>
      <td>사용자의 인증과 로그인 유지에 대한 메커니즘을 깊게 학습하였고 토큰 탈취 등에 대비한 Refresh Token을 추가하였습니다.</td>
   </tr>
</table>

<br/>

## 😎 서비스 주요기능
> 📌 GIF는 배포중인 [zete-zustand-reactQuery 버전](https://github.com/zeriong/zete-zustand-reactQuery)의 시연입니다.
<ul>
   <li>
      카테고리 생성, 수정, 삭제
   </li>
   <li>
      메모 추가, 수정, 삭제, 검색
      <code>(작성 시 자동적으로 저장되어 별도의 저장버튼 불필요)</code>
   </li>
   <li>
      카테고리 생성, 수정, 삭제
      <code>(생성된 태그는 카테고리 하위 네비게이션에 노출)</code>
   </li>
</ul>

<img width="80%" src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/b2012316-eb0a-4e72-84e9-ae94bbe13256"/>

<br/><br/>

<ul>
   <li>
      메모 입력 하단영역에 AI<code>(Chat GPT)</code>에게
      원하는 정보를 질문하고 그 답변을 메모할 수 있습니다.
   </li>
</ul>

<img width="80%" src="https://github.com/zeriong/zete-zustand-reactQuery/assets/115396103/5483d2b7-ebac-4428-9dc2-fd7649fd3240"/>

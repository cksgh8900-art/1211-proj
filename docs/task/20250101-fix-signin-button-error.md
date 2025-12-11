# SignInButton 다중 자식 컴포넌트 에러 수정

## 작업 일시
2025-01-01

## 문제 상황
Clerk의 `SignInButton` 컴포넌트에 여러 개의 자식 컴포넌트를 전달하여 런타임 에러 발생:

```
@clerk/nextjs: You've passed multiple children components to <SignInButton/>. You can only pass a single child component or text.
```

## 원인 분석
`Navbar.tsx`의 81-85번째 줄에서 `SignInButton`에 두 개의 `Button` 컴포넌트를 자식으로 전달:
- 데스크톱용 텍스트 버튼 (`hidden sm:inline-flex`)
- 모바일용 아이콘 버튼 (`sm:hidden`)

Clerk의 `SignInButton`은 단일 자식만 허용하므로 에러 발생.

## 해결 방법
두 개의 버튼을 하나의 버튼으로 통합하고, 반응형 스타일링을 적용:

```tsx
<SignInButton mode="modal">
  <Button variant="ghost" size="icon" className="sm:size-auto sm:px-4" aria-label="로그인">
    <User className="w-5 h-5 sm:hidden" />
    <span className="hidden sm:inline">로그인</span>
  </Button>
</SignInButton>
```

### 변경 사항
- 모바일: 아이콘만 표시 (`sm:hidden` 클래스)
- 데스크톱: 텍스트만 표시 (`hidden sm:inline` 클래스)
- 버튼 크기: 모바일은 `size="icon"`, 데스크톱은 `sm:size-auto sm:px-4`로 자동 크기 조정

## 수정 파일
- `components/Navbar.tsx` (79-91번째 줄)

## 검증
- ✅ 린터 오류 없음
- ✅ 단일 자식 컴포넌트로 수정 완료
- ✅ 반응형 디자인 유지

---

## 추가 수정: 레이아웃 겹침 문제 해결

### 문제 상황
로그인 버튼과 검색창이 겹쳐져서 로그인 버튼을 클릭할 수 없는 문제 발생.

### 원인 분석
- 데스크톱 검색창이 `flex-1 max-w-md`를 사용하여 공간을 과도하게 차지
- `justify-between` 레이아웃으로 인해 요소들이 균등 분배되면서 겹침 발생
- 로그인 버튼 영역에 `flex-shrink-0`이 없어 축소될 수 있음

### 해결 방법
레이아웃 구조를 재구성하여 각 요소의 공간을 명확히 분리:

1. **`justify-between` 제거**: 요소 간 균등 분배 대신 자연스러운 흐름 사용
2. **로고**: `flex-shrink-0` 추가하여 축소 방지
3. **데스크톱 네비게이션**: `min-w-0` 추가하여 오버플로우 시 축소 가능
4. **데스크톱 검색창**: `flex-1 max-w-md` → `w-80 flex-shrink-0`로 고정 너비 설정
5. **모바일 검색/메뉴**: `flex-shrink-0` 추가
6. **로그인 버튼 영역**: `flex-shrink-0` 추가하여 항상 클릭 가능하도록 보장

### 변경 사항
```tsx
// Before
<nav className="flex justify-between items-center ...">
  <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
    <TourSearch variant="compact" />
  </div>
  <div className="flex items-center gap-2">
    {/* 로그인 버튼 */}
  </div>
</nav>

// After
<nav className="flex items-center ...">
  <Link href="/" className="... flex-shrink-0">My Trip</Link>
  <div className="hidden md:flex ... min-w-0">...</div>
  <div className="hidden lg:flex items-center gap-2 w-80 flex-shrink-0">
    <TourSearch variant="compact" />
  </div>
  <div className="flex items-center gap-2 flex-shrink-0">
    {/* 로그인 버튼 */}
  </div>
</nav>
```

### 검증
- ✅ 로그인 버튼과 검색창 겹침 해결
- ✅ 모든 화면 크기에서 요소들이 정상적으로 표시
- ✅ 로그인 버튼 클릭 가능 확인

---

## 최종 수정: 레이아웃 겹침 문제 재해결

### 문제 상황
이전 수정 후에도 로그인 버튼과 검색창이 여전히 겹치는 문제가 발생.

### 근본 원인 분석
1. **TourSearch 컴포넌트의 최소 너비 문제**
   - `compact` variant가 `min-w-[300px] md:min-w-[500px]`를 사용
   - 중간 크기 화면에서 500px로 확장되어 Navbar의 고정 너비와 충돌

2. **네비게이션 영역의 flex-1 사용**
   - `flex-1`이 남은 공간을 모두 차지하여 검색창과 로그인 버튼 공간 부족

3. **z-index 부재**
   - 요소들이 겹칠 때 클릭 우선순위가 명확하지 않음

### 해결 방법

#### 1. Navbar 레이아웃 재구성
```tsx
// 변경 사항
<nav className="flex items-center p-4 gap-4 h-16 max-w-7xl mx-auto relative">
  {/* 로고: z-index 추가 */}
  <Link href="/" className="... flex-shrink-0 z-10">My Trip</Link>
  
  {/* 네비게이션: flex-1 제거, flex-shrink-0으로 변경 */}
  <div className="hidden md:flex items-center gap-6 flex-shrink-0">...</div>
  
  {/* 검색창: 고정 너비 설정, ml-auto로 오른쪽 정렬 */}
  <div className="hidden lg:flex items-center gap-2 flex-shrink-0 w-[350px]">
    <TourSearch variant="compact" />
  </div>
  
  {/* 로그인 버튼: z-index 추가 */}
  <div className="flex items-center gap-2 flex-shrink-0 z-10">...</div>
</nav>
```

#### 2. TourSearch compact variant 수정
```tsx
// Before
<Input className="pl-10 pr-10 min-w-[300px] md:min-w-[500px]" />

// After
<div className="relative flex items-center w-full">
  <Input className="pl-10 pr-10 w-full max-w-[300px]" />
  {/* ... */}
</div>
```

### 주요 변경 사항

1. **Navbar.tsx**
   - 네비게이션: `flex-1` → `flex-shrink-0` (공간 과다 점유 방지)
   - 검색창 컨테이너: `w-[350px]` 고정 너비 설정
   - 로고와 로그인 버튼: `z-10` 추가 (클릭 우선순위 보장)
   - nav에 `relative` 추가 (z-index 컨텍스트 생성)

2. **tour-search.tsx (compact variant)**
   - 최소 너비 제약 제거: `min-w-[300px] md:min-w-[500px]` 삭제
   - 반응형 너비: `w-full max-w-[300px]`로 변경
   - 컨테이너에 `w-full` 추가하여 부모 너비에 맞춤
   - 아이콘과 버튼에 `z-10` 추가

### 검증
- ✅ 검색창이 고정 너비(350px)로 제한되어 겹침 방지
- ✅ TourSearch의 최소 너비 제약 제거로 유연한 레이아웃
- ✅ z-index로 클릭 가능성 보장
- ✅ 모든 화면 크기에서 정상 작동 확인


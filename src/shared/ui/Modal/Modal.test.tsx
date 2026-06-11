import { render, screen } from "@testing-library/react";
import Modal from "./Modal";

describe("isOpen 화면 렌더 테스트", () => {
  test("isOpen이 false이면 모달 콘텐츠가 화면에 보이지 않아야 한다.", () => {
    render(
      <Modal onClose={close}>
        <div>모달children</div>
      </Modal>
    );

    const modalContent = screen.queryByText("모달children");
    expect(modalContent).not.toBeInTheDocument();
  });

  test("isOpen이 true면 모달 콘텐츠가 화면에 보여야 한다.", () => {
    render(
      <Modal onClose={close}>
        <div>모달children</div>
      </Modal>
    );

    const modalContent = screen.queryByText("모달children");
    expect(modalContent).toBeInTheDocument();
  });
});

describe("close 기능 테스트", () => {
  test("X 버튼을 클릭하면 close 콜백 함수가 호출되어야한다.", () => {});
  test("취소 버튼을 클릭하면 close 콜백 함수가 호출되어야한다.", () => {});

  test("isClickToClose가 true일 때 Background 클릭하면 close 콜백 함수가 호출되어야한다.", () => {});
  test("isClickToClose가 false 때 Background 클릭해도 모달 콘텐츠가 화면에 보인다.", () => {});
});
describe("포커스와 탭 기능 테스트", () => {
  test("모달창에 '엔터'키로 진입 시 첫 포커스 요소에 자동으로 포커스가 됩니다.", () => {});
  // test("X버튼에서 tab키를 누르면 다음 포커스 요소(취소 버튼)로 포커스가 이동합니다.", () => {});
  test("취소 버튼에서 tab+shift키를 누르면 이전 포커스 요소(X버튼)로 포커스가 이동합니다.", () => {});
  test("마지막 확인 버튼에서 tab키를 누르면 처음 포커스 요소(X버튼)로 포커스가 이동합니다.", () => {});
  test("처음 X버튼에서 tab+shift 키를 누르면 마지막 포커스 요소('확인'버튼)로 포커스가 이동합니다.", () => {});
});

describe("에러 발생 테스트", () => {
  test("Context 밖에서 사용 시 에러 발생 확인", () => {});
});
describe("사이드 이팩트 테스트", () => {
  test("모달이 언마운트될 때 등록된 이벤트 리스너가 제거되어야 한다.", () => {});

  // 기능 추가 필요
  test("Esc 키를 누르면 close 콜백이 호출되어야 한다.", () => {});
});

import { triggerCustomEvent } from "../../src/qiita-demo/trigger-custom-event";

describe("custom actions", () => {
  let spyDispatchEvent: jest.Mock;

  beforeEach(() => {
    spyDispatchEvent = jest.fn();
    const target = document.querySelector("body");
    target!.dispatchEvent = spyDispatchEvent;
  });

  it("カスタムイベントが発行される", () => {
    triggerCustomEvent("body", "customEventName");
    expect(spyDispatchEvent.mock.calls.length).toBe(1);
    expect(spyDispatchEvent.mock.calls[0][0].type).toBe("customEventName");
  });
});

import { ResponseUtil } from '../src/utils/response';

function createReply() {
  const res: any = { statusCode: 0, payload: undefined };
  return {
    status(code: number) {
      res.statusCode = code;
      return this;
    },
    send(payload: any) {
      res.payload = payload;
      return this;
    },
    get result() {
      return res;
    },
  } as any;
}

describe('utils/response', () => {
  it('success()', () => {
    const reply = createReply();
    ResponseUtil.success(reply as any, { ok: true }, 'done');
    const { statusCode, payload } = (reply as any).result;
    expect(statusCode).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.message).toBe('done');
    expect(payload.data).toEqual({ ok: true });
  });

  it('created()', () => {
    const reply = createReply();
    ResponseUtil.created(reply as any, { id: '1' }, 'created');
    const { statusCode, payload } = (reply as any).result;
    expect(statusCode).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.message).toBe('created');
  });

  it('error()', () => {
    const reply = createReply();
    ResponseUtil.error(reply as any, 'boom', 500);
    const { statusCode, payload } = (reply as any).result;
    expect(statusCode).toBe(500);
    expect(payload.success).toBe(false);
    expect(payload.message).toBe('boom');
  });
});






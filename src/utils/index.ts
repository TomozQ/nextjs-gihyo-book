export const fetcher = async (
  resource: RequestInfo,
  init?: RequestInit,
  // eslint-disable-next-line @typescript-eslint/noexplicit-any
):Promise<any> => {
  const res = await fetch(resource, init)

  if (!res.ok) {
    // レスポンスが失敗したときに例外を投げる
    const errorRes = await res.json()
    const error = new Error(
      errorRes.message ?? 'APIリクエスト中にエラーが発生しました',
    )

    throw error
  }

  return res.json()
}
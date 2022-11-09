import useSWR from 'swr'

/**
 *  useSWRフックはkey文字列とfetcher関数を受け取る
 *  keyはデータの一位な識別子（通常はAPIのURL）で、fetcherに渡される。
 *  第二引数のfetcherは、データを返す任意の非同期関数が入る。
 *  ネイティブで実装されているfetchや、ライブラリのAxiosなど他の関数を使うことも可能
 *
 *  このフックは、リクエストの状態に基づいてdataとerrorの2つの値を返す。
 *  dataにはAPIのレスポンスが入っており、errorはAPIのリクエストが失敗したときに値が入るようになっている。
 */
// type User = {
//   name: string
// }

// const Profile = () => {
//   const { data, error } = useSWR<User>('/api/user', fetcher)

//   if(error) return <div>failed to load</div>
//   if(!data) return <div>loading...</div>
//   return <div>Hello {data.name}</div>
// }

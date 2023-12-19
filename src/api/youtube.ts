
const { youtubeApiKey } = process.env

export default async function getStringifyYoutubeMusic(title: string): Promise<string> {
  const data = await getYoutubeMusic(title);
  console.log(parseLinks(data));
  return parseLinks(data);
}

export function checkYoutubeLink(input: string) {
  // 유튜브 URL 찾는 패턴
  const youtubeUrl = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g
  return youtubeUrl.test(input)
}

export async function getYoutubeMusic(title?: string) {
  const fetchedData = await (
    await fetch( 
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title}&maxResults=1&key=${youtubeApiKey}`
    )
  ).json();
  return fetchedData;
}

export function parseLinks(data: any): any {
  return {
    items: data.items.map((item: any) => {
      return `https://www.youtube.com/watch?v=${item.id.videoId}`;
    }),
  };
}

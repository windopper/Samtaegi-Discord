export function testYoutubeLink(input: string) {
    // 유튜브 URL 찾는 패턴
    const youtubeUrl = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/
    return youtubeUrl.test(input)
  }
  
  export function testYoutubePlayListLink(input: string) {
    return /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/.test(input);
  }
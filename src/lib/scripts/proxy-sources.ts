export interface ProxySource {
  id: string;
  name: string;
  driveId: string;
  priority: number;
  folderFilter?: RegExp;
  folderFilterMode?: "include" | "exclude";
  filenameParser: (filename: string) => {
    cardName: string;
    artist?: string;
    setCode?: string;
  } | null;
  description?: string;
}

export const PROXY_SOURCES: ProxySource[] = [
  {
    id: "johnprime-borderless",
    name: "JohnPrime Borderless",
    driveId: "1O7t2uQXu9Ypzgn05mMwjzwRs7OyhM2sT",
    priority: 1,
    folderFilter: undefined,
    filenameParser: (filename: string) => {
      const match = filename.match(/^(.+?)\s+\((?:Borderless(?:,\s*|\s+))([^)]+?)\)(?:\s+\[([A-Z0-9]+)\])?\.(jpg|png)$/i);

      if (!match) return null;

      return {
        cardName: match[1].trim(),
        artist: match[2].trim(),
        setCode: match[3]?.trim(),
      };
    },
    description: "High quality borderless proxies.",
  },
  {
    id: "pozzum",
    name: "Pozzum Collection",
    driveId: "1i-VF3HfkmnYT8la5hacHYxOhHcs-DghY",
    priority: 2,
    folderFilter: /tokens|z\d{2}_.+|!_.+|paper/i,
    folderFilterMode: "exclude",
    filenameParser: (filename: string) => {
      const match = filename.match(/^(.+?)\s+\(Extended\s+(.+?)\)\.(?:jpg|png)$/i);

      if (!match) return null;

      const cardName = match[1].trim();
      const artistAndExtra = match[2].trim();

      const setMatch = artistAndExtra.match(/^(.+?)\s+([A-Z0-9]{3,4}|[0-9]{4})$/);

      if (setMatch) {
        return {
          cardName,
          artist: setMatch[1].trim(),
          setCode: setMatch[2].trim(),
        };
      }

      return {
        cardName,
        artist: artistAndExtra,
        setCode: undefined,
      };
    },
    description: "Older card collection, extended frame.",
  },
];

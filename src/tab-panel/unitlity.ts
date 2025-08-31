type FinalDataTypes = {
  primary: number[];
  secondary: number[];
  tertiary: number[];
};

const finalData: FinalDataTypes = {
  primary: [1, 2, 3],
  secondary: [4, 5, 6],
  tertiary: [7, 8, 9],
};

export type TabType = keyof FinalDataTypes;

export function getData(tab: TabType): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(finalData[tab]);
    }, Math.random() * 1000);
  });
}

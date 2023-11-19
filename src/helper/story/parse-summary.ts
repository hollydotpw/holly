export default function parseSummary(data: string): StoryRaw {
  const summaryJson = /^<!--SUMMARY-START([\s\S]+)SUMMARY-END-->/i.exec(data);

  return JSON.parse(summaryJson[1]);
}

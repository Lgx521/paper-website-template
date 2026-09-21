// 修改这个文件，然后运行 node scripts/build.mjs 即可更新整页。
// 文本字段为纯文本，不需要 HTML；换行使用 \n。
export default {
  lang: 'en',
  title: 'Your Paper Title Goes Here\nWith a Descriptive Subtitle',
  shortTitle: 'Your Paper Title',
  description: 'A concise, one-sentence summary of your research contribution.',
  // 发布论文时填入最终网址；留空则不输出 canonical / og:url。
  siteUrl: '',
  socialImage: '', // 可选：绝对 HTTPS 图片地址，用于分享卡片
  venue: 'PAPER TEMPLATE · YEAR / VENUE', // 不需要则设为 ''
  authors: [
    { name: 'First Author', affiliations: [1, 2], marker: '*', url: '' },
    { name: 'Second Author', affiliations: [1], marker: '*', url: '' },
    { name: 'Third Author', affiliations: [2], url: '' },
    { name: 'Corresponding Author', affiliations: [1, 2], marker: '†', url: '' },
  ],
  authorNote: '* Equal contribution.  † Corresponding author.',
  institutions: [
    { id: 1, name: 'The Hong Kong University of Science and Technology', shortName: 'HKUST', logo: 'assets/logos/hkust.svg', url: 'https://hkust.edu.hk/', width: 182 },
    { id: 2, name: 'Southern University of Science and Technology', shortName: 'SUSTech', logo: 'assets/logos/sustech.svg', url: 'https://www.sustech.edu.cn/en/', width: 175 },
  ],
  // 空 href 显示为 “Coming soon”，不会跳到不存在的页面；删除条目即可隐藏。
  resources: [
    { label: 'Paper', icon: 'paper', href: '' },
    { label: 'Code', icon: 'code', href: '' },
    { label: 'Video', icon: 'video', href: '#video' },
  ],
  teaser: {
    type: 'placeholder', // placeholder | image | video | youtube
    label: 'Project video',
    hint: 'A short visual introduction to your research.',
    caption: 'An overview of the problem, the proposed method, and the main result.',
    // 图片：type: 'image', src: 'assets/figures/teaser.jpg', alt: '描述图片内容'
    // 本地视频：type: 'video', src: 'assets/videos/teaser.mp4', poster: 'assets/figures/poster.jpg'
    // 可选字幕：tracks: [{ src: 'assets/videos/captions.vtt', label: 'English', lang: 'en', default: true }]
    // YouTube：type: 'youtube', videoId: '11位视频ID'
  },
  abstract: 'Replace this paragraph with your paper’s abstract. Introduce the problem and explain why it matters, identify the limitation of existing approaches, and summarize your key idea. Describe the evaluation setting and the most important findings. Finish with the broader significance of the work. Keep this section self-contained so that readers can understand the contribution before exploring the figures and experiments below.',
  // 段落、图片、视频和图组可自由增删；visible: false 可隐藏整节。
  sections: [
    {
      id: 'problem', title: 'Problem',
      paragraphs: ['What makes this problem difficult? Describe the setting, the assumptions, and the gap that motivates your work. Use the figure below to make the research question concrete.'],
      media: [{ type: 'placeholder', label: 'Problem illustration', hint: 'Research setting · Key challenge · Desired outcome', caption: 'Figure 1. Introduce the problem and highlight the challenge addressed by your method.', aspect: 'wide' }],
    },
    {
      id: 'method', title: 'Method',
      paragraphs: ['Introduce the main idea of your approach. Explain the role of each component and how they work together. Replace the example pipeline with your own architecture, algorithm, or system overview.'],
      media: [{ type: 'image', src: 'assets/figures/method-placeholder.svg', alt: 'Example pipeline with three stages: input, proposed method, and output.', caption: 'Figure 2. An example pipeline layout. Replace it with the method figure from your paper.' }],
    },
    {
      id: 'simulation', title: 'Simulation Performance',
      paragraphs: ['Describe the benchmarks, evaluation metrics, and comparison methods. Explain the main trend shown in each plot and report the evidence that supports your conclusions.'],
      media: [
        { type: 'placeholder', label: 'Main results', hint: 'Benchmark or performance plot', caption: '(a) Main quantitative comparison.', aspect: 'plot' },
        { type: 'placeholder', label: 'Ablation study', hint: 'Contribution of individual components', caption: '(b) Ablation or sensitivity analysis.', aspect: 'plot' },
      ],
      columns: 2,
    },
    {
      id: 'real-world', title: 'Real-World Performance',
      experiments: [
        { title: 'Experiment 1', paragraphs: ['Introduce the first experimental setting. State the task, conditions, and the behavior readers should look for in the demonstration.'], media: [{ type: 'placeholder', label: 'Experiment video', hint: 'Demonstration or side-by-side comparison', caption: 'Describe the experimental conditions and what the demonstration shows.', aspect: 'video' }] },
        { title: 'Experiment 2', paragraphs: ['Use a second experiment to show generalization, robustness, or a different task. Include representative successes and limitations where appropriate.'], media: [{ type: 'placeholder', label: 'Additional results', hint: 'A second experiment or qualitative figure', caption: 'Explain how this experiment complements the first result.', aspect: 'wide' }] },
      ],
    },
  ],
  takeaways: [
    'State the main conceptual or methodological contribution in one sentence.',
    'Summarize the strongest experimental evidence supporting the approach.',
    'Describe the practical implications, limitations, or next research direction.',
  ],
  // 完整保留你的引用格式；不自动生成虚构 DOI 或 arXiv 编号。
  bibtex: `@misc{authorYEARshorttitle,
  title  = {Your Paper Title Goes Here With a Descriptive Subtitle},
  author = {First Author and Second Author and Third Author and Corresponding Author},
  year   = {YEAR},
  note   = {Replace with the publication venue or preprint information}
}`,
};

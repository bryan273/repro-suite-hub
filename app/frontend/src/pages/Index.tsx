import { useEffect, useState } from 'react';
import SuiteTopBar from '@/components/SuiteTopBar';
import { Reveal, SectionHead, ShowcaseFrame } from '@/components/SuiteUI';
import { SHOTS, URLS } from '@/lib/content';

type Lang = 'en' | 'zh' | 'vi' | 'id';
type Theme = 'light' | 'dark';
const THEME_KEY = 'repro.theme2';
const LANG_KEY = 'rs-lang';
const LANGS: readonly Lang[] = ['en', 'zh', 'vi', 'id'];
const HTML_LANG: Record<Lang, string> = { en: 'en', zh: 'zh-CN', vi: 'vi', id: 'id' };
const text2 = 'text-[color:var(--text2)]';

/** Every string of the landing page, in the four languages the whole suite speaks. */
const S: Record<Lang, {
  eyebrow: string; title: string; sub: string; try: string;
  nav: [string, string, string];
  products: { name: string; text: string; cta: string; tag: string }[];
  startTitle: string; startSub: string;
  steps: { h: string; p: string }[];
  whyEyebrow: string; whyTitle: string; whyLead: string;
  why: { h: string; p: string }[];
  usesTitle: string; usesSub: string; usesHead: [string, string, string]; uses: [string, string, string][];
  faqTitle: string; faq: { q: string; a: string }[];
  ctaTitle: string; ctaBody: string; ctaLabel: string;
  team: string; partners: string; shot: (n: string) => string;
}> = {
  en: {
    eyebrow: 'Paperlit', title: 'From information to understanding.',
    sub: 'Paperlit turns one source, a paper, an article or your own notes, into the way you learn best: a short video, a guided read, deep questions and answers, or a check of the results. Video is where most people start.',
    try: 'See how it works',
    nav: ['What you get', 'How it works', 'FAQ'],
    products: [
      { tag: 'Learn', name: 'Video learning', text: 'A narrated video with chapters, and questions that stop the video to check you understood.', cta: 'Make my video' },
      { tag: 'Read', name: 'Text learning', text: 'Read the source with answers that point to the page they come from.', cta: 'Open the reader' },
      { tag: 'Explore', name: 'Deep learning', text: 'Ask anything in depth, take a final quiz, and keep notes and flashcards.', cta: 'Start learning' },
      { tag: 'Check', name: 'Research reproduction', text: 'For papers with public code: re-run it and see whether the reported number holds.', cta: 'Check a paper' },
    ],
    startTitle: 'One source, many ways to learn', startSub: 'Between what you bring and what you get back, the AI does five things to the source.',
    steps: [{ h: 'Bring a source', p: 'A paper, an article or your own notes, as a link, a PDF or pasted text. Lecture videos and podcasts are coming.' }, { h: 'The AI transforms it', p: 'Understanding, summarizing, explaining, restructuring and verifying, at your level and in your language.' }, { h: 'Learn it your way', p: 'Watch a video, read with cited answers, go deep with questions and a quiz, or have the result re-run.' }],
    whyEyebrow: 'Why you can trust it', whyTitle: 'Every number traces back to the paper.', whyLead: 'No black-box answers. You can check each step yourself.',
    why: [
      { h: 'Quotes are matched', p: 'A quote only appears in a video if it is found word for word in the paper. Anything else is removed.' },
      { h: 'Numbers are matched', p: 'Every number on screen has to appear in the paper text.' },
      { h: 'Verdicts are earned', p: 'The agent fixes its tolerance first, then runs the code twice from scratch before it says the result holds.' },
    ],
    usesTitle: 'Who it is for', usesSub: 'The same source becomes something different for each person.', usesHead: ['Who', 'Brings', 'Gets'],
    uses: [['Students', 'Lecture notes, or a paper set for class', 'A short video per topic and a quiz before the exam'], ['Researchers', 'A new paper in their field', 'The gist in three minutes, a read with cited answers, then a check of the result'], ['Teachers', 'A reading for the class', 'A video to share by link, with questions inside it for students'], ['Curious readers', 'An article they saved', 'A clear explanation in their own language']],
    faqTitle: 'Questions people ask',
    faq: [
      { q: 'What is Paperlit?', a: 'A learning platform that turns one source, a paper, an article or your notes, into the way you learn best. Most people start with a short video that teaches the paper, then ask questions, take a quiz or check whether the results are real.' },
      { q: 'What can I drop in?', a: 'An arXiv link, a PDF link, a DOI, or a PDF from your computer.' },
      { q: 'Which languages?', a: 'English, 中文, Tiếng Việt and Bahasa Indonesia, for the page and for the video.' },
      { q: 'How do you stop the AI from inventing things?', a: 'Every quote and number in a video is matched against the paper text, and what does not match is removed.' },
      { q: 'Is it free?', a: 'You can try it without signing up. A free account gets a video every day, and plans start at ¥33 a month for 50 videos.' },
    ],
    ctaTitle: 'Learn anything, in the way that works for you.', ctaBody: 'Make your first video free.', ctaLabel: 'Make my video',
    team: 'Group 1, Tsinghua SIGS AIID capstone', partners: 'Partners: DeepWisdom and StepFun', shot: (n) => `Screenshot of ${n}`,
  },
  zh: {
    eyebrow: 'Paperlit', title: '从信息，到理解。',
    sub: 'Paperlit 把一份资料，论文、文章或你自己的笔记，变成最适合你的学习方式：一段短视频、一次带引用的精读、深入问答，或者对结果的复现检查。大多数人从视频开始。',
    try: '看看怎么用',
    nav: ['你能得到什么', '怎么用', '常见问题'],
    products: [
      { tag: '学', name: '视频学习', text: '有旁白、分章节的视频，视频内会暂停提问，确认你真的看懂。', cta: '制作我的视频' },
      { tag: '读', name: '文本学习', text: '读原文，回答会标出出处页码。', cta: '打开阅读器' },
      { tag: '探', name: '深度学习', text: '深入追问任何问题，做期末测验，导出笔记和闪卡。', cta: '开始学习' },
      { tag: '验', name: '研究复现', text: '对公开代码的论文：重新运行，看报告的数字是否成立。', cta: '检验一篇论文' },
    ],
    startTitle: '一份资料，多种学法', startSub: '从你带来的资料到你拿到的结果之间，AI 对资料做了五件事。',
    steps: [{ h: '带来一份资料', p: '论文、文章或你自己的笔记，可以是链接、PDF 或粘贴的文字。课程视频和播客即将支持。' }, { h: 'AI 来转化', p: '理解、提炼、讲解、重组和核实，按你的水平、用你的语言。' }, { h: '用你的方式学', p: '看视频、带引用地阅读、提问加测验深入学，或者让结果重新跑一遍。' }],
    whyEyebrow: '为什么可信', whyTitle: '每个数字都能回到原文。', whyLead: '没有黑箱答案，每一步你都能自己核对。',
    why: [
      { h: '引文逐字比对', p: '引文只有在论文中逐字找到才会出现在视频里，其余都会被删除。' },
      { h: '数字逐个比对', p: '屏幕上的每个数字都必须出现在论文文本中。' },
      { h: '结论靠运行得出', p: '智能体先定容差，再从头运行两次代码，才会说结果成立。' },
    ],
    usesTitle: '适合谁', usesSub: '同一份资料，对每个人变成不同的东西。', usesHead: ['谁', '带来', '得到'],
    uses: [['学生', '课堂笔记，或老师布置的论文', '每个主题一段短视频，考前一套测验'], ['研究者', '本领域的一篇新论文', '三分钟抓住要点，带引用地精读，再检查结果'], ['教师', '给学生的一篇阅读材料', '一段可用链接分享的视频，视频里带题目'], ['好奇的读者', '收藏的一篇文章', '用自己语言讲清楚的解释']],
    faqTitle: '常见问题',
    faq: [
      { q: 'Paperlit 是什么？', a: '一个学习平台：把一份资料，论文、文章或笔记，变成最适合你的学习方式。多数人先从讲解论文的短视频开始，再提问、做测验，或检验结果是不是真的。' },
      { q: '可以丢进什么？', a: 'arXiv 链接、PDF 链接、DOI，或你电脑里的 PDF。' },
      { q: '支持哪些语言？', a: '页面和视频都支持 English、中文、Tiếng Việt 和 Bahasa Indonesia。' },
      { q: '如何避免 AI 编造内容？', a: '视频中的每句引文和每个数字都会与论文原文比对，对不上的会被删除。' },
      { q: '免费吗？', a: '无需注册即可试用。免费账号每天可做一个视频，套餐每月 ¥33 起，含 50 个视频。' },
    ],
    ctaTitle: '学任何东西，用最适合你的方式。', ctaBody: '免费做第一个视频。', ctaLabel: '制作我的视频',
    team: '清华 SIGS AIID 课程项目第 1 组', partners: '合作方：DeepWisdom 与 StepFun', shot: (n) => `${n} 截图`,
  },
  vi: {
    eyebrow: 'Paperlit', title: 'Từ thông tin đến hiểu biết.',
    sub: 'Paperlit biến một nguồn, một bài báo khoa học, một bài viết hay ghi chú của chính bạn, thành cách học hợp với bạn nhất: một video ngắn, một lần đọc có trích dẫn, hỏi đáp chuyên sâu, hoặc kiểm tra lại kết quả. Phần lớn mọi người bắt đầu từ video.',
    try: 'Xem cách hoạt động',
    nav: ['Bạn nhận được gì', 'Cách hoạt động', 'Câu hỏi thường gặp'],
    products: [
      { tag: 'Học', name: 'Học qua video', text: 'Video có lời dẫn, chia chương, và câu hỏi dừng video lại để kiểm tra bạn đã hiểu.', cta: 'Tạo video của tôi' },
      { tag: 'Đọc', name: 'Học qua văn bản', text: 'Đọc nguồn cùng câu trả lời chỉ rõ trang được trích.', cta: 'Mở trình đọc' },
      { tag: 'Khám phá', name: 'Học chuyên sâu', text: 'Hỏi sâu bất cứ điều gì, làm bài kiểm tra cuối, lưu ghi chú và thẻ ghi nhớ.', cta: 'Bắt đầu học' },
      { tag: 'Kiểm', name: 'Tái lập nghiên cứu', text: 'Với bài báo có mã công khai: chạy lại và xem con số có đúng không.', cta: 'Kiểm chứng một bài báo' },
    ],
    startTitle: 'Một nguồn, nhiều cách học', startSub: 'Giữa thứ bạn mang đến và thứ bạn nhận lại, AI làm năm việc với nguồn đó.',
    steps: [{ h: 'Mang đến một nguồn', p: 'Bài báo, bài viết hay ghi chú của bạn, dưới dạng liên kết, PDF hoặc văn bản dán vào. Video bài giảng và podcast sắp có.' }, { h: 'AI chuyển hóa', p: 'Hiểu, tóm lược, giải thích, tái cấu trúc và kiểm chứng, theo trình độ và ngôn ngữ của bạn.' }, { h: 'Học theo cách của bạn', p: 'Xem video, đọc kèm trích dẫn, đi sâu bằng câu hỏi và bài kiểm tra, hoặc cho chạy lại kết quả.' }],
    whyEyebrow: 'Vì sao đáng tin', whyTitle: 'Mọi con số đều truy về bài báo.', whyLead: 'Không có câu trả lời hộp đen. Bạn tự kiểm tra được từng bước.',
    why: [
      { h: 'Trích dẫn được đối chiếu', p: 'Một trích dẫn chỉ xuất hiện trong video nếu tìm thấy nguyên văn trong bài báo. Phần còn lại bị loại.' },
      { h: 'Con số được đối chiếu', p: 'Mọi con số trên màn hình phải có trong văn bản bài báo.' },
      { h: 'Kết luận có căn cứ', p: 'Tác tử cố định dung sai trước, rồi chạy mã hai lần từ đầu trước khi nói kết quả đúng.' },
    ],
    usesTitle: 'Dành cho ai', usesSub: 'Cùng một nguồn, mỗi người nhận được một thứ khác nhau.', usesHead: ['Ai', 'Mang đến', 'Nhận được'],
    uses: [['Sinh viên', 'Ghi chú bài giảng, hoặc bài báo được giao', 'Mỗi chủ đề một video ngắn và một bài kiểm tra trước kỳ thi'], ['Nhà nghiên cứu', 'Một bài báo mới trong lĩnh vực', 'Nắm ý chính trong ba phút, đọc kèm trích dẫn, rồi kiểm tra kết quả'], ['Giảng viên', 'Một bài đọc cho lớp', 'Một video chia sẻ bằng liên kết, có câu hỏi trong video cho sinh viên'], ['Người tò mò', 'Một bài viết đã lưu', 'Một lời giải thích rõ ràng bằng ngôn ngữ của mình']],
    faqTitle: 'Câu hỏi thường gặp',
    faq: [
      { q: 'Paperlit là gì?', a: 'Một nền tảng học tập biến một nguồn, bài báo, bài viết hay ghi chú của bạn, thành cách học hợp với bạn nhất. Phần lớn mọi người bắt đầu bằng một video ngắn giảng giải bài báo, rồi đặt câu hỏi, làm bài kiểm tra hoặc xem kết quả có thật không.' },
      { q: 'Tôi có thể thả gì vào?', a: 'Liên kết arXiv, liên kết PDF, DOI, hoặc tệp PDF từ máy tính của bạn.' },
      { q: 'Có những ngôn ngữ nào?', a: 'English, 中文, Tiếng Việt và Bahasa Indonesia, cho cả trang web lẫn video.' },
      { q: 'Làm sao ngăn AI bịa đặt?', a: 'Mọi trích dẫn và con số trong video đều được đối chiếu với văn bản bài báo, phần nào không khớp sẽ bị loại.' },
      { q: 'Có miễn phí không?', a: 'Bạn có thể dùng thử mà không cần đăng ký. Tài khoản miễn phí có một video mỗi ngày, và các gói bắt đầu từ 89.000đ mỗi tháng cho 50 video.' },
    ],
    ctaTitle: 'Học bất cứ điều gì, theo cách hợp với bạn.', ctaBody: 'Tạo video đầu tiên miễn phí.', ctaLabel: 'Tạo video của tôi',
    team: 'Nhóm 1, đồ án AIID Tsinghua SIGS', partners: 'Đối tác: DeepWisdom và StepFun', shot: (n) => `Ảnh chụp màn hình ${n}`,
  },
  id: {
    eyebrow: 'Paperlit', title: 'Dari informasi menjadi pemahaman.',
    sub: 'Paperlit mengubah satu sumber, makalah, artikel, atau catatan Anda sendiri, menjadi cara belajar yang paling cocok untuk Anda: video singkat, membaca dengan rujukan, tanya jawab mendalam, atau pengecekan hasil. Kebanyakan orang mulai dari video.',
    try: 'Lihat cara kerjanya',
    nav: ['Yang Anda dapat', 'Cara kerja', 'Tanya jawab'],
    products: [
      { tag: 'Belajar', name: 'Belajar lewat video', text: 'Video bernarasi dengan bab, dan pertanyaan yang menghentikan video untuk mengecek pemahaman Anda.', cta: 'Buat video saya' },
      { tag: 'Baca', name: 'Belajar lewat teks', text: 'Baca sumbernya dengan jawaban yang menunjuk halaman asalnya.', cta: 'Buka pembaca' },
      { tag: 'Jelajahi', name: 'Belajar mendalam', text: 'Tanyakan apa saja secara mendalam, kerjakan kuis akhir, simpan catatan dan kartu hafalan.', cta: 'Mulai belajar' },
      { tag: 'Periksa', name: 'Reproduksi riset', text: 'Untuk makalah dengan kode terbuka: jalankan ulang dan lihat apakah angkanya benar.', cta: 'Periksa sebuah makalah' },
    ],
    startTitle: 'Satu sumber, banyak cara belajar', startSub: 'Di antara yang Anda bawa dan yang Anda terima, AI melakukan lima hal pada sumber itu.',
    steps: [{ h: 'Bawa satu sumber', p: 'Makalah, artikel, atau catatan Anda, berupa tautan, PDF, atau teks yang ditempel. Video kuliah dan podcast segera hadir.' }, { h: 'AI mengubahnya', p: 'Memahami, meringkas, menjelaskan, menyusun ulang, dan memverifikasi, sesuai tingkat dan bahasa Anda.' }, { h: 'Pelajari dengan cara Anda', p: 'Tonton video, baca dengan rujukan, dalami lewat pertanyaan dan kuis, atau jalankan ulang hasilnya.' }],
    whyEyebrow: 'Mengapa layak dipercaya', whyTitle: 'Setiap angka bisa dilacak ke makalahnya.', whyLead: 'Tidak ada jawaban kotak hitam. Anda bisa memeriksa tiap langkah sendiri.',
    why: [
      { h: 'Kutipan dicocokkan', p: 'Kutipan hanya muncul di video jika ditemukan kata demi kata di makalah. Yang lain dibuang.' },
      { h: 'Angka dicocokkan', p: 'Setiap angka di layar harus ada di teks makalah.' },
      { h: 'Putusan dibuktikan', p: 'Agen menetapkan toleransi lebih dulu, lalu menjalankan kode dua kali dari awal sebelum menyatakan hasilnya berlaku.' },
    ],
    usesTitle: 'Untuk siapa', usesSub: 'Sumber yang sama menjadi sesuatu yang berbeda bagi setiap orang.', usesHead: ['Siapa', 'Membawa', 'Mendapat'],
    uses: [['Mahasiswa', 'Catatan kuliah, atau makalah tugas', 'Video singkat per topik dan kuis sebelum ujian'], ['Peneliti', 'Makalah baru di bidangnya', 'Inti dalam tiga menit, membaca dengan jawaban bersitasi, lalu cek hasilnya'], ['Pengajar', 'Bacaan untuk kelas', 'Video yang dibagikan lewat tautan, dengan pertanyaan di dalamnya'], ['Pembaca yang penasaran', 'Artikel yang disimpan', 'Penjelasan jelas dalam bahasanya sendiri']],
    faqTitle: 'Tanya jawab',
    faq: [
      { q: 'Apa itu Paperlit?', a: 'Platform belajar yang mengubah satu sumber, makalah, artikel, atau catatan Anda, menjadi cara belajar yang paling cocok. Kebanyakan orang mulai dengan video singkat yang mengajarkan makalah, lalu bertanya, mengerjakan kuis, atau memeriksa apakah hasilnya nyata.' },
      { q: 'Apa yang bisa saya masukkan?', a: 'Tautan arXiv, tautan PDF, DOI, atau PDF dari komputer Anda.' },
      { q: 'Bahasa apa saja?', a: 'English, 中文, Tiếng Việt dan Bahasa Indonesia, untuk halaman maupun video.' },
      { q: 'Bagaimana AI dicegah mengarang?', a: 'Setiap kutipan dan angka di video dicocokkan dengan teks makalah, dan yang tidak cocok dibuang.' },
      { q: 'Apakah gratis?', a: 'Anda bisa mencobanya tanpa mendaftar. Akun gratis mendapat satu video per hari, dan paket mulai dari Rp79.000 per bulan untuk 50 video.' },
    ],
    ctaTitle: 'Pelajari apa saja, dengan cara yang cocok untuk Anda.', ctaBody: 'Buat video pertama gratis.', ctaLabel: 'Buat video saya',
    team: 'Kelompok 1, proyek akhir AIID Tsinghua SIGS', partners: 'Mitra: DeepWisdom dan StepFun', shot: (n) => `Tangkapan layar ${n}`,
  },
};

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as T) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

const FT: Record<Lang, { explore: string; examples: string; pricing: string; about: string; terms: string; privacy: string; contact: string; rights: string }> = {
  en: { explore: 'Explore', examples: 'Examples', pricing: 'Pricing', about: 'About', terms: 'Terms', privacy: 'Privacy', contact: 'Contact', rights: 'All rights reserved.' },
  zh: { explore: '探索', examples: '示例', pricing: '价格', about: '关于', terms: '条款', privacy: '隐私', contact: '联系我们', rights: '版权所有。' },
  vi: { explore: 'Khám phá', examples: 'Ví dụ', pricing: 'Bảng giá', about: 'Giới thiệu', terms: 'Điều khoản', privacy: 'Quyền riêng tư', contact: 'Liên hệ', rights: 'Bảo lưu mọi quyền.' },
  id: { explore: 'Jelajahi', examples: 'Contoh', pricing: 'Harga', about: 'Tentang', terms: 'Ketentuan', privacy: 'Privasi', contact: 'Kontak', rights: 'Hak cipta dilindungi.' },
};
const HREF = [URLS.explainer, URLS.reading, URLS.explainer, URLS.repro];
const SHOWN = [0, 1, 3];   // the cards that have a screenshot: video, text, reproduction
const SHOT_KEYS = [SHOTS.explainer, SHOTS.reading, SHOTS.repro];
const NAMES = ['Explain', 'Read', 'Reproduce'];

export default function Index() {
  const initial = (() => {
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('zh') ? 'zh' : nav.startsWith('vi') ? 'vi' : nav.startsWith('id') ? 'id' : 'en';
  })() as Lang;
  const [lang, setLang] = useState<Lang>(() => read('suite-lang', LANGS, read(LANG_KEY, LANGS, initial)));
  const [theme, setTheme] = useState<Theme>(() => read(THEME_KEY, ['light', 'dark'], window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const t = S[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode */ }
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    try { localStorage.setItem(LANG_KEY, lang); localStorage.setItem('suite-lang', lang); } catch { /* private mode */ }
  }, [lang]);

  const nav = [
    { label: t.nav[0], href: '#tools' },
    { label: t.nav[1], href: '#start' },
    { label: t.nav[2], href: '#faq' },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <SuiteTopBar
        appId="hub"
        nav={nav}
        dark={theme === 'dark'}
        onToggleDark={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        lang={lang}
        onLang={(l) => setLang(l as Lang)}
        languages={['en', 'zh', 'vi', 'id']}
      />

      <main id="top" className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <section className="su-hero">
          <span className="su-pill"><i />{t.eyebrow}</span>
          <h1 className="su-title">{t.title}</h1>
          <p className="su-sub">{t.sub}</p>
          <div className="su-cta">
            <a href={HREF[0]} className="su-btn">{t.products[0].cta}</a>
            <a href="#start" className="su-btn-2">{t.try}</a>
          </div>
          <ShowcaseFrame
            slides={SHOWN.map((p, k) => ({ key: NAMES[k], label: t.products[p].name, url: HREF[p].replace('https://', ''), src: SHOT_KEYS[k], alt: t.shot(t.products[p].name) }))}
          />
        </section>

        <section className="su-section" id="tools">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.products.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <a href={HREF[i]} className="su-card block h-full rounded-[22px] border border-[color:var(--line)] p-6 no-underline transition hover:-translate-y-0.5" style={{ background: 'var(--card, transparent)' }}>
                  <span className="su-pill"><i />{p.tag}</span>
                  <h2 className="mt-3 text-[22px] font-bold tracking-[-0.02em]">{p.name}</h2>
                  <p className={`mt-2 text-[15px] leading-relaxed ${text2}`}>{p.text}</p>
                  <span className="su-btn mt-5 inline-flex">{p.cta}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="su-section" id="start">
          <Reveal><SectionHead center eyebrow={t.nav[1]} title={t.startTitle} lead={t.startSub} /></Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.h} className="rounded-[18px] border border-[color:var(--line)] p-5">
                <span className={`text-[13px] font-semibold ${text2}`}>{i + 1}</span>
                <h3 className="text-[18px] font-bold">{s.h}</h3>
                <p className={`mt-1 text-[14.5px] ${text2}`}>{s.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="su-section" id="uses">
          <Reveal><SectionHead center eyebrow={t.eyebrow} title={t.usesTitle} lead={t.usesSub} /></Reveal>
          <div className="mt-8 overflow-hidden rounded-[18px] border border-[color:var(--line)]">
            <div className={`hidden gap-4 border-b border-[color:var(--line)] px-5 py-3 text-[13px] font-semibold sm:grid sm:grid-cols-[1fr_1.4fr_1.8fr] ${text2}`}>
              {t.usesHead.map((h) => <span key={h}>{h}</span>)}
            </div>
            {t.uses.map(([who, from, to], i) => (
              <div key={who} className={`grid gap-1 px-5 py-4 sm:grid-cols-[1fr_1.4fr_1.8fr] sm:gap-4 ${i ? 'border-t border-[color:var(--line)]' : ''}`}>
                <b className="text-[16px]">{who}</b>
                <span className={`text-[14.5px] ${text2}`}>{from}</span>
                <span className="text-[14.5px]">{to}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="su-section" id="why">
          <Reveal><SectionHead center eyebrow={t.whyEyebrow} title={t.whyTitle} lead={t.whyLead} /></Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.why.map((w) => (
              <div key={w.h} className="rounded-[18px] border border-[color:var(--line)] p-5">
                <h3 className="text-[17px] font-bold">{w.h}</h3>
                <p className={`mt-1 text-[14.5px] leading-relaxed ${text2}`}>{w.p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="su-section" id="faq">
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">{t.faqTitle}</h2>
          <div className="mt-5 overflow-hidden rounded-[16px] border border-[color:var(--line)]">
            {t.faq.map((f, i) => (
              <details key={f.q} className={i ? 'border-t border-[color:var(--line)]' : ''}>
                <summary className="cursor-pointer list-none px-5 py-4 text-[15.5px] font-semibold">{f.q}</summary>
                <p className={`px-5 pb-5 text-[14.5px] leading-relaxed ${text2}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="su-section">
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[22px] bg-[#1d1d1f] px-8 py-9 text-white dark:bg-white dark:text-[#1d1d1f]">
            <div>
              <h2 className="text-[26px] font-bold tracking-[-0.02em]">{t.ctaTitle}</h2>
              <p className="mt-1 opacity-80">{t.ctaBody}</p>
            </div>
            <a href={HREF[0]} className="rounded-full bg-white px-6 py-3 font-semibold text-[#1d1d1f] no-underline dark:bg-[#1d1d1f] dark:text-white">{t.ctaLabel}</a>
          </div>
        </section>

        <footer className={`mt-14 grid gap-8 border-t border-[color:var(--line)] py-10 text-[14px] sm:grid-cols-[1.4fr_1fr_1fr_1fr] ${text2}`}>
          <div>
            <p className="font-bold text-[16px]" style={{ color: 'inherit' }}>Paperlit</p>
            <p className="mt-1 max-w-[30ch]">{t.title}</p>
          </div>
          {[
            { h: 'Paperlit', l: [[t.products[0].name, HREF[0]], [t.products[1].name, HREF[1]], [t.products[3].name, HREF[3]]] },
            { h: FT[lang].explore, l: [[FT[lang].examples, `${HREF[0]}#examples`], [FT[lang].pricing, `${HREF[0]}#pricing`], ['FAQ', '#faq']] },
            { h: FT[lang].about, l: [[FT[lang].terms, `${HREF[0]}/terms`], [FT[lang].privacy, `${HREF[0]}/privacy`], [FT[lang].contact, `${HREF[0]}#contact`]] },
          ].map((c) => (
            <nav key={c.h} className="grid content-start gap-2" aria-label={String(c.h)}>
              <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'inherit' }}>{c.h}</p>
              {c.l.map(([n, h]) => <a key={n} href={h} className="inline-block py-1.5 no-underline hover:underline" style={{ color: 'inherit' }}>{n}</a>)}
            </nav>
          ))}
          <p className="sm:col-span-4 border-t border-[color:var(--line)] pt-5 text-[13px]" style={{ color: 'inherit' }}>&copy; {new Date().getFullYear()} Paperlit. {FT[lang].rights}</p>
        </footer>
      </main>
    </div>
  );
}

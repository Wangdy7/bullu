import type { AdmissionTask } from './types'

const internationalDocuments = [
  { id: 'passport', label: '护照原件（信息页、入境章）' },
  { id: 'evisa', label: 'eVISA 与 eVAL' },
  { id: 'emgs', label: 'EMGS Approval Letter' },
  { id: 'offer', label: 'Full Offer Letter' },
  { id: 'academic', label: '学历原件与中英文公证件' },
  { id: 'mdac', label: 'MDAC 电子入境卡' },
  { id: 'photos', label: '证件照' },
  { id: 'receipts', label: '学费 / 保证金收据' },
  { id: 'medical-form', label: '打印并填写体检表' },
]

const localDocuments = [
  { id: 'offer', label: 'Offer Letter 与注册通知' },
  { id: 'academic', label: '学历原件与成绩单' },
  { id: 'identity', label: '身份证件（按学校要求）' },
  { id: 'photos', label: '证件照' },
  { id: 'receipts', label: '学费 / 保证金收据' },
  { id: 'forms', label: '学校要求的注册表格' },
]

export const admissionTasks: AdmissionTask[] = [
  {
    id: 'documents',
    number: '01',
    title: '确认录取与准备文件',
    subtitle: '把注册需要的文件先放进一个袋子',
    summary:
      '先核对 Offer Letter、注册通知和身份文件。国际学生还要检查签证、eVAL 和 EMGS 文件；本地学生按学校通知准备身份证件和学历原件。',
    icon: 'documents',
    audience: 'all',
    steps: [
      {
        title: '核对录取信息',
        detail: '确认姓名、学号、专业、学院和注册时间。发现信息不一致时先联系学校，不要等到报到当天。',
      },
      {
        title: '准备原件与复印件',
        detail: '学历文件通常需要核验原件；复印件份数、公证件和照片要求以学院或注册处通知为准。',
      },
      {
        title: '分开整理文件',
        detail: '把随身文件、托运行李和电子备份分开。重要文件不要只放在手机里。',
      },
      {
        title: '检查有效期',
        detail: '检查护照、签证和相关文件的有效期。MDAC、签证和体检要求请以马来西亚移民局及学校最新通知为准。',
      },
    ],
    checklist: {
      international: internationalDocuments,
      local: localDocuments,
    },
    officialLinks: [
      { label: 'UKM 新生注册入口', url: 'https://join.ukm.my/' },
      { label: 'MDAC 电子入境卡', url: 'https://imigresen-online.imi.gov.my/mdac/main?registerMain' },
    ],
    faqs: [
      {
        question: '文件需要准备几份？',
        answer: '不同学院和注册处的份数要求可能不同。先按学校邮件准备，并保留一套电子备份。',
      },
      {
        question: '信息不一致怎么办？',
        answer: '先暂停提交，联系学院或注册处更正。不要自行修改正式文件上的姓名、学号或专业信息。',
      },
    ],
    helpPrompt: '不确定某份文件是否需要原件？',
  },
  {
    id: 'medical',
    number: '02',
    title: '完成入学体检',
    subtitle: '查看医院、准备材料并完成体检',
    summary:
      '按学校通知选择指定医院或 Pusat Kesihatan UKM。费用、流程和出结果时间以医院现场为准；本步骤适用于国际学生。',
    icon: 'medical',
    audience: 'international',
    steps: [
      {
        title: '选择体检地点',
        detail: '按学校最新通知选择指定医院或 Pusat Kesihatan UKM。入学季人多，建议尽量安排在上午。',
      },
      {
        title: '带齐材料',
        detail: '带打印好的体检表、照片和护照。是否需要空腹、是否需要提前预约，以医院要求为准。',
      },
      {
        title: '按现场顺序检查',
        detail: '一般包括登记、X-ray、缴费、尿检/抽血、身高体重与视力检查，实际顺序以医院指引为准。',
      },
      {
        title: '领取并提交报告',
        detail: '拿到报告后按学校要求完成签字、盖章或上传。报告页数和提交方式以学校通知为准。',
      },
    ],
    checklist: {
      international: [
        { id: 'hospital', label: '确认体检医院与营业时间' },
        { id: 'form', label: '打印并填写体检表' },
        { id: 'photos', label: '准备医院要求的照片' },
        { id: 'passport', label: '携带护照' },
        { id: 'fasting', label: '确认是否需要空腹' },
        { id: 'report', label: '领取并检查体检报告' },
        { id: 'submit', label: '按要求提交报告' },
      ],
      local: [],
    },
    officialLinks: [{ label: 'UKM 官网', url: 'https://www.ukm.my/' }],
    location: { label: 'Pusat Kesihatan UKM', targetId: 'health' },
    faqs: [
      {
        question: '体检费用是多少？',
        answer: '费用会因医院、项目和当年的要求变化。页面不提供固定金额，请以医院现场和学校通知为准。',
      },
      {
        question: '可以到校后再体检吗？',
        answer: '是否可以在校内完成、是否需要提前预约，取决于学校当年的安排。先查看注册通知中的体检要求。',
      },
    ],
    helpPrompt: '体检流程或医院安排不确定？',
  },
  {
    id: 'online',
    number: '03',
    title: '完成线上注册',
    subtitle: '上传材料并等待学校审核',
    summary:
      '线上注册是后续线下核验的前提。上传前逐份检查清晰度、页数和签字，提交后保存确认页面。',
    icon: 'online',
    audience: 'all',
    steps: [
      {
        title: '登录注册系统',
        detail: '进入 join.ukm.my，按系统提示填写资料。开放时间和登录方式以学校通知为准。',
      },
      {
        title: '上传材料',
        detail: '按系统要求上传体检报告、护照或身份证件、缴费收据、eVAL 等适用材料。',
      },
      {
        title: '检查文件',
        detail: '逐份打开检查清晰度、方向和页数。文件名尽量使用英文和数字，避免特殊符号。',
      },
      {
        title: '提交并保存确认',
        detail: '提交后保存确认页面或邮件，并留意系统状态。补交材料和审核时间以实际通知为准。',
      },
    ],
    checklist: {
      international: [
        { id: 'login', label: '登录 join.ukm.my' },
        { id: 'medical', label: '体检报告完整' },
        { id: 'passport', label: '护照扫描件' },
        { id: 'receipt', label: '学费 / 保证金收据' },
        { id: 'eval', label: 'eVAL 等签证文件' },
        { id: 'verify', label: '逐份检查上传文件' },
        { id: 'submit', label: '提交并保存确认信息' },
      ],
      local: [
        { id: 'login', label: '登录 join.ukm.my' },
        { id: 'identity', label: '身份证件扫描件' },
        { id: 'academic', label: '学历文件扫描件' },
        { id: 'receipt', label: '学费 / 保证金收据' },
        { id: 'verify', label: '逐份检查上传文件' },
        { id: 'submit', label: '提交并保存确认信息' },
      ],
    },
    officialLinks: [{ label: 'join.ukm.my', url: 'https://join.ukm.my/' }],
    faqs: [
      {
        question: '提交后还能修改吗？',
        answer: '是否允许修改取决于系统状态和学校安排。提交前先检查，若状态已锁定请直接联系注册处。',
      },
      {
        question: '审核需要多久？',
        answer: '页面不虚构审核时长。请查看系统状态和学校邮件，必要时联系学院或注册处。',
      },
    ],
    helpPrompt: '上传材料时卡住了？',
  },
  {
    id: 'onboarding',
    number: '04',
    title: '校园报到',
    subtitle: '带原件到指定地点完成现场核验',
    summary:
      '线上审核通过后，按通知前往指定地点核验原件。现场可能收取护照用于后续签证流程，具体安排以学校通知为准。',
    icon: 'onboarding',
    audience: 'all',
    steps: [
      {
        title: '确认报到地点',
        detail: '查看学院或学校邮件中的报到地点、时间和入口。不同学院的安排可能不同。',
      },
      {
        title: '带齐原件',
        detail: '带齐所有原件和要求的复印件，工作人员会逐项核对，学历文件通常需要出示原件。',
      },
      {
        title: '现场核验',
        detail: '按指引排队、提交材料并确认个人信息。若被收取护照，记下用途和预计归还时间。',
      },
      {
        title: '领取校园卡',
        detail: '按学院通知领取学生证并完成激活，后续图书馆、借书和部分门禁会用到。',
      },
      {
        title: '保存回执',
        detail: '保存报到回执、缴费凭证和下一步说明，后续签证或选课可能还会用到。',
      },
    ],
    checklist: {
      international: [
        { id: 'place', label: '确认报到地点与时间' },
        { id: 'originals', label: '所有原件' },
        { id: 'copies', label: '按通知准备复印件' },
        { id: 'receipts', label: '缴费与注册回执' },
        { id: 'passport', label: '确认护照提交与归还安排' },
        { id: 'card', label: '领取并激活校园卡' },
        { id: 'keep', label: '保存回执和下一步说明' },
      ],
      local: [
        { id: 'place', label: '确认报到地点与时间' },
        { id: 'originals', label: '身份证件与学历原件' },
        { id: 'copies', label: '按通知准备复印件' },
        { id: 'receipts', label: '缴费与注册回执' },
        { id: 'card', label: '领取并激活校园卡' },
        { id: 'keep', label: '保存回执和下一步说明' },
      ],
    },
    officialLinks: [{ label: 'UKM 官网', url: 'https://www.ukm.my/' }],
    location: { label: 'Pusanika 校园中心' },
    faqs: [
      {
        question: '可以请别人代办报到吗？',
        answer: '通常需要本人核验身份和原件。是否可以代办请直接向学院或注册处确认。',
      },
      {
        question: '护照什么时候归还？',
        answer: '如现场收取护照，请向工作人员确认用途和预计归还时间，并保留回执。',
      },
    ],
    helpPrompt: '找不到报到地点？',
  },
  {
    id: 'visa',
    number: '05',
    title: '学生签证',
    subtitle: '提交护照并跟进 EMGS 进度',
    summary:
      '国际学生按学校通知前往 Pusanika 签证中心提交护照和相关材料。进度与领取方式以 EMGS 和学校通知为准。',
    icon: 'visa',
    audience: 'international',
    steps: [
      {
        title: '提交材料',
        detail: '按通知前往 Pusanika 签证中心，提交护照、eVAL 和工作人员要求的其他材料。',
      },
      {
        title: '确认联系方式',
        detail: '按现场指引填写信息，确认手机号和邮箱能正常接收通知。',
      },
      {
        title: '跟进进度',
        detail: '通过 EMGS 或学校渠道查看进度，达到指定阶段后留意领取通知。',
      },
      {
        title: '领取并检查护照',
        detail: '按通知前往指定地点领取贴好学生签证的护照，当场检查姓名、签证类型和有效期。',
      },
    ],
    checklist: {
      international: [
        { id: 'passport', label: '护照原件' },
        { id: 'eval', label: 'eVAL 与学校要求的文件' },
        { id: 'submit', label: '在 Pusanika 提交' },
        { id: 'contact', label: '确认手机号和邮箱可用' },
        { id: 'track', label: '跟进 EMGS 进度' },
        { id: 'collect', label: '收到通知后领取护照' },
        { id: 'check', label: '检查签证姓名与有效期' },
      ],
      local: [],
    },
    officialLinks: [{ label: 'UKM 官网', url: 'https://www.ukm.my/' }],
    location: { label: 'Pusanika 签证中心' },
    faqs: [
      {
        question: '签证进度在哪里看？',
        answer: '使用 EMGS 或学校提供的渠道查看。不要使用非官方代办提供的“审核通过”截图作为正式状态。',
      },
      {
        question: '可以提前拿回护照吗？',
        answer: '是否允许临时借用护照取决于签证流程和学校安排，请直接咨询签证中心。',
      },
    ],
    helpPrompt: '签证进度或领取方式不清楚？',
  },
  {
    id: 'courses',
    number: '06',
    title: '学生账号与选课',
    subtitle: '激活邮箱、进入 SMP，完成第一学期选课',
    summary:
      '注册完成后，学校会开通学生邮箱和选课系统权限。先确认课程结构，再在规定窗口内完成选课和改课。',
    icon: 'courses',
    audience: 'all',
    steps: [
      {
        title: '激活学生邮箱',
        detail: '及时激活 UKM 官方邮箱。学术通知和学校沟通通常会发送到该邮箱。',
      },
      {
        title: '登录 SMP',
        detail: '通过学校提供的入口登录 SMP 选课系统，确认课程结构和可选课程。',
      },
      {
        title: '检查课表',
        detail: '确认 lecture、tutorial 时间不冲突，并核对学分上限和先修要求。',
      },
      {
        title: '完成选课',
        detail: '在规定的选课和改课窗口内完成操作。具体日期和规则以学校通知为准。',
      },
    ],
    checklist: {
      international: [
        { id: 'email', label: '激活 UKM 学生邮箱' },
        { id: 'smp', label: '登录 SMP 系统' },
        { id: 'schedule', label: '确认课程表与 SET 组合' },
        { id: 'credits', label: '核对学分上限与先修要求' },
        { id: 'register', label: '完成第一学期选课' },
        { id: 'verify', label: '检查最终课表与冲突' },
      ],
      local: [
        { id: 'email', label: '激活 UKM 学生邮箱' },
        { id: 'smp', label: '登录 SMP 系统' },
        { id: 'schedule', label: '确认课程表与 SET 组合' },
        { id: 'credits', label: '核对学分上限与先修要求' },
        { id: 'register', label: '完成第一学期选课' },
        { id: 'verify', label: '检查最终课表与冲突' },
      ],
    },
    officialLinks: [
      { label: 'UKM 官网', url: 'https://www.ukm.my/' },
      { label: 'join.ukm.my', url: 'https://join.ukm.my/' },
    ],
    location: { label: '校园地图' },
    faqs: [
      {
        question: '选课时间是什么时候？',
        answer: '选课和改课时间每学期不同，请以学院、SMP 和学校邮件的最新通知为准。',
      },
      {
        question: '课程冲突怎么办？',
        answer: '先查看课程结构和替代课程，再联系学院学术顾问。不要自行忽略必修课或先修要求。',
      },
    ],
    helpPrompt: '选课系统或课程结构看不懂？',
  },
]

export function tasksForAudience(audience: 'international' | 'local') {
  return admissionTasks.filter((task) => task.audience === 'all' || task.audience === audience)
}

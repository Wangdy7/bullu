import type { FreshmanTask } from './types'

export const freshmanTasks: FreshmanTask[] = [
  {
    id: 'materials',
    number: '01',
    title: '材料准备',
    subtitle: '把出发前必须带齐的文件收进一个袋子',
    summary:
      '护照、签证、录取文件和体检表缺一不可。建议原件随身，复印件和电子版各留一套，出发前逐项核对。',
    icon: 'materials',
    steps: [
      {
        title: '核心证件',
        detail:
          '护照原件（信息页与入境章）、eVISA、eVAL、EMGS Approval Letter、Full Offer Letter。',
      },
      {
        title: '学历文件',
        detail:
          '本科 / 硕士 / 高中毕业证、学位证与成绩单原件，以及中英文公证件。到校注册时通常需要核验原件。',
      },
      {
        title: '其他材料',
        detail:
          'MDAC 电子入境卡、白底 / 蓝底证件照、学费与保证金缴费收据。MDAC 请以马来西亚移民局官网的最新要求为准。',
      },
      {
        title: '体检表',
        detail:
          '提前下载并打印体检表，填写个人信息。建议至少准备 2–3 份，具体份数以医院和学校通知为准。',
      },
    ],
    checklist: [
      { id: 'passport', label: '护照原件（信息页、入境章）' },
      { id: 'evisa', label: 'eVISA 与 eVAL' },
      { id: 'emgs', label: 'EMGS Approval Letter' },
      { id: 'offer', label: 'Full Offer Letter' },
      { id: 'academic', label: '学历原件与中英文公证件' },
      { id: 'mdac', label: 'MDAC 电子入境卡' },
      { id: 'photos', label: '证件照（按学校要求准备）' },
      { id: 'receipts', label: '学费 / 保证金缴费收据' },
      { id: 'medical-form', label: '打印并填写体检表' },
    ],
    links: [
      { label: 'UKM 新生注册入口', url: 'https://join.ukm.my/' },
      {
        label: 'MDAC 电子入境卡',
        url: 'https://imigresen-online.imi.gov.my/mdac/main?registerMain',
      },
    ],
    helpPrompt: '不确定某份材料是否需要原件？',
  },
  {
    id: 'medical',
    number: '02',
    title: '体检',
    subtitle: '选择医院、带齐材料，按顺序完成检查',
    summary:
      '可以按学校通知选择校外指定医院或 UKM 校医院。不同医院流程和出结果时间不同，费用与安排以现场为准。',
    icon: 'medical',
    steps: [
      {
        title: '选择体检地点',
        detail:
          '按学校最新通知选择指定医院或 Pusat Kesihatan UKM。入学季人较多，建议尽量安排在上午。',
      },
      {
        title: '出发前准备',
        detail:
          '带上打印好的体检表、照片和护照；如有条件，先填写个人资料。体检前避免饮酒，是否需要空腹以医院要求为准。',
      },
      {
        title: '到院后的顺序',
        detail:
          '柜台登记 → 胸部 X-ray → 缴费 → 领取体检表 → 尿检 / 抽血 → 身高、体重与视力 → 等待结果。实际顺序以医院现场指引为准。',
      },
      {
        title: '领取报告',
        detail:
          '拿到医院报告后，按学校要求带回校医院或指定窗口签字盖章。报告页数和签字要求以学校通知为准。',
      },
    ],
    checklist: [
      { id: 'book', label: '确认体检医院与营业时间' },
      { id: 'form', label: '打印体检表并填写个人信息' },
      { id: 'photos', label: '准备医院要求的照片' },
      { id: 'passport', label: '携带护照' },
      { id: 'fasting', label: '确认是否需要空腹' },
      { id: 'report', label: '领取并检查体检报告' },
      { id: 'chop', label: '按学校要求完成签字 / 盖章' },
    ],
    links: [
      { label: 'UKM 官网', url: 'https://www.ukm.my/' },
    ],
    locationId: 'health',
    locationLabel: 'Pusat Kesihatan UKM',
    helpPrompt: '体检流程和医院安排不确定？',
  },
  {
    id: 'online',
    number: '03',
    title: '线上注册',
    subtitle: '在 join.ukm.my 上传材料并等待审核',
    summary:
      '线上注册是后续线下核验的前提。上传前先检查每份文件是否清晰、完整，提交后保留确认页面或邮件。',
    icon: 'online',
    steps: [
      {
        title: '登录注册系统',
        detail:
          '进入 UKM 新生注册系统 join.ukm.my，按系统提示填写资料。具体开放时间和登录方式以学校通知为准。',
      },
      {
        title: '上传材料',
        detail:
          '按系统要求上传体检报告、护照扫描件、学费收据、eVAL 等材料。体检报告通常需要页数齐全、签字盖章完整。',
      },
      {
        title: '检查文件',
        detail:
          '上传后逐一打开文件检查清晰度和方向，确认没有漏页。文件名建议使用英文和数字，避免特殊符号。',
      },
      {
        title: '等待审核',
        detail:
          '提交后留意系统状态和学校邮件。是否需要补交材料、审核需要多久，以学校和系统实际通知为准。',
      },
    ],
    checklist: [
      { id: 'login', label: '登录 join.ukm.my' },
      { id: 'medical', label: '体检报告（页数、签字、盖章完整）' },
      { id: 'passport', label: '护照扫描件' },
      { id: 'receipt', label: '学费 / 保证金收据' },
      { id: 'eval', label: 'eVAL 与其他签证文件' },
      { id: 'verify', label: '逐份打开检查上传文件' },
      { id: 'submit', label: '提交并保存确认信息' },
    ],
    links: [{ label: 'join.ukm.my', url: 'https://join.ukm.my/' }],
    helpPrompt: '上传材料时卡住了？',
  },
  {
    id: 'onsite',
    number: '04',
    title: '线下报到',
    subtitle: '带原件到指定地点完成现场核验',
    summary:
      '线上审核通过后，按通知前往 UKM SHAPE 或所在学院注册处。现场会核对原件，并可能收取护照用于后续签证流程。',
    icon: 'onsite',
    steps: [
      {
        title: '确认报到地点',
        detail:
          '查看学院或学校邮件中的报到地点、时间和入口。不同学院的安排可能不同，不要只参考同学的经验。',
      },
      {
        title: '携带材料',
        detail:
          '带齐所有原件和复印件。工作人员会逐项核对，学历文件通常必须出示原件。',
      },
      {
        title: '现场核验',
        detail:
          '按现场指引排队、提交材料并确认个人信息。若被收取护照，记下用途和预计归还时间。',
      },
      {
        title: '领取校园卡',
        detail:
          '按学院通知领取学生证并完成激活。后续进图书馆、借书和部分校内门禁都会用到。',
      },
      {
        title: '保留回执',
        detail:
          '保存报到回执、缴费凭证和工作人员给出的下一步说明，后续签证或选课可能还会用到。',
      },
    ],
    checklist: [
      { id: 'place', label: '确认报到地点与时间' },
      { id: 'originals', label: '所有原件' },
      { id: 'copies', label: '按通知准备复印件' },
      { id: 'receipts', label: '缴费与注册回执' },
      { id: 'passport', label: '确认护照提交与归还安排' },
      { id: 'card', label: '领取并激活校园卡' },
      { id: 'keep', label: '保存现场回执和下一步说明' },
    ],
    links: [{ label: 'UKM 官网', url: 'https://www.ukm.my/' }],
    locationLabel: '校园地图（以通知地点为准）',
    helpPrompt: '找不到报到地点？',
  },
  {
    id: 'visa',
    number: '05',
    title: '签证办理',
    subtitle: '提交护照，跟进 EMGS 进度',
    summary:
      '按学校通知前往 Pusanika 签证中心提交护照和相关材料。进度和领取方式以 EMGS 与学校通知为准，不要轻信非官方代办。',
    icon: 'visa',
    steps: [
      {
        title: '提交材料',
        detail:
          '按通知前往 Pusanika 签证中心，提交护照、eVAL 和工作人员要求的其他材料。',
      },
      {
        title: '填写信息',
        detail:
          '按现场指引扫码或填写个人信息，确认手机号和邮箱能正常接收通知。',
      },
      {
        title: '跟进进度',
        detail:
          '通过 EMGS 或学校提供的渠道查看进度。进度达到 100% 后，留意领取护照的邮件或通知。',
      },
      {
        title: '领取护照',
        detail:
          '按通知前往 PKP 领取贴好学生签证的护照。领取时当场检查姓名、签证类型和有效期。',
      },
    ],
    checklist: [
      { id: 'passport', label: '护照原件' },
      { id: 'eval', label: 'eVAL 与学校要求的文件' },
      { id: 'submit', label: '在 Pusanika 签证中心提交' },
      { id: 'contact', label: '确认手机号和邮箱可用' },
      { id: 'track', label: '跟进 EMGS 进度' },
      { id: 'collect', label: '收到通知后前往 PKP 领取' },
      { id: 'check', label: '检查签证姓名与有效期' },
    ],
    links: [{ label: 'UKM 官网', url: 'https://www.ukm.my/' }],
    locationId: 'pusanika',
    locationLabel: 'Pusanika 签证中心',
    helpPrompt: '签证进度或领取方式不清楚？',
  },
  {
    id: 'systems',
    number: '06',
    title: '学生系统激活与选课',
    subtitle: '开通邮箱、进入 SMP，完成第一学期选课',
    summary:
      '注册完成后，学校会开通学生邮箱和选课系统权限。先确认课程结构，再在规定窗口内完成选课和改课。',
    icon: 'systems',
    steps: [
      {
        title: '激活学生邮箱',
        detail:
          '及时激活 UKM 官方邮箱。学术通知和学校沟通通常会发送到该邮箱，避免只使用私人邮箱。',
      },
      {
        title: '登录 SMP',
        detail:
          '通过学校提供的入口登录 SMP 选课系统，确认自己的课程结构和可选课程。',
      },
      {
        title: '检查课表',
        detail:
          '提前找好课程表，确认 lecture、tutorial 时间不冲突，并核对学分上限和先修要求。',
      },
      {
        title: '完成选课 / 改课',
        detail:
          '在规定的选课和改课窗口内完成操作。逾期可能产生罚款或无法改课，具体日期以学校通知为准。',
      },
    ],
    checklist: [
      { id: 'email', label: '激活 UKM 学生邮箱' },
      { id: 'smp', label: '登录 SMP 选课系统' },
      { id: 'schedule', label: '确认课程表与 SET 组合' },
      { id: 'credits', label: '核对学分上限与先修要求' },
      { id: 'register', label: '完成第一学期选课' },
      { id: 'verify', label: '检查最终课表与时间冲突' },
    ],
    links: [
      { label: 'UKM 官网', url: 'https://www.ukm.my/' },
      { label: 'join.ukm.my', url: 'https://join.ukm.my/' },
    ],
    locationLabel: '校园地图',
    helpPrompt: '选课系统或课程结构看不懂？',
  },
]

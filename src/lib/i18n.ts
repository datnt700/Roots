export type Locale = 'en' | 'vi' | 'fr'

export const locales: Locale[] = ['en', 'vi', 'fr']

type NavbarTranslations = {
  navbar: {
    logoSubtext: string
    story: string
    howItWorks: string
    technology: string
    joinWaitlist: string
    languageLabel: string
  }
  hero: {
    tagline: string
    subtitle: string
    headlineLine1: string
    headlineHighlight: string
    description: string
    primaryButton: string
    secondaryButton: string
  }
  problem: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
    cards: Array<{
      title: string
      description: string
      quote: string
    }>
    emotionalQuote: string
    emotionalAttribution: string
  }
  solution: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
    steps: Array<{
      title: string
      subtitle: string
      description: string
      features: string[]
    }>
  }
  competitive: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
    rootsTitle: string
    rootsSubtitle: string
    othersTitle: string
    othersSubtitle: string
    comparisons: Array<{
      feature: string
      roots: string
      others: string
    }>
    advantages: Array<{
      title: string
      description: string
    }>
  }
  tech: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
    features: Array<{
      title: string
      description: string
      status: string
    }>
    marketLabel: string
    marketTitle: string
    metrics: Array<{
      value: string
      label: string
    }>
    marketText: string
  }
  finalCta: {
    quoteText: string
    quoteHighlight: string
    visionText: string
    emailPlaceholder: string
    submitButton: string
    successTitle: string
    successText: string
    secondaryCtas: string[]
  }
  footer: {
    logoSubtext: string
    privacyPolicy: string
    termsOfService: string
    contact: string
    madeWith: string
    inVietnam: string
    tagline: string
  }
}

export type TranslationSchema = NavbarTranslations

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    navbar: {
      logoSubtext: '(ROOTS)',
      story: 'Our Vision',
      howItWorks: 'How It Works',
      technology: 'Featured Technology',
      joinWaitlist: 'Preserve Memories Now',
      languageLabel: 'Language',
    },
    hero: {
      tagline: 'Dont let memories turn into regrets',
      subtitle: '(ROOTS)',
      headlineLine1: 'Half a world apart,',
      headlineHighlight: 'yet souls still touch.',
      description:
        'Turning miles of distance into moments of understanding. We help international students preserve the voices and untold chapters of their parents before time fades everything away.',
      primaryButton: 'Start the Connection Journey',
      secondaryButton: 'The Math of Time',
    },
    problem: {
      sectionLabel: 'The Harsh Truth',
      sectionTitle: 'The Heartbreaking Math of Living Abroad',
      sectionDescription:
        'Have you ever dared to calculate how many chances you truly have left to understand your parents before it is too late?',
      cards: [
        {
          title: 'The Finite Number 20',
          description:
            'If you visit once a year, you may only have 20 times left to share a meal with your parents. Every year that passes is an opportunity lost forever.',
          quote:
            'I was shocked to realize I had less than 30 days of actual time left with my parents for the rest of their lives.',
        },
        {
          title: 'The "Familiar Stranger" Fear',
          description:
            'Zalo messages arrive, FaceTime calls connect, but you slowly lose touch with what your parents are truly thinking. You are losing them while they are still here.',
          quote:
            'The scariest thing is coming home and realizing I missed an entire vital chapter of my mothers life.',
        },
        {
          title: 'The Empty Echo',
          description:
            'Messaging apps are just quick communication tools, not treasure chests. One day, you will crave to hear a piece of advice again, but there will only be silence.',
          quote:
            'Scrolling through old texts is not the same as hearing the warmth in my fathers voice.',
        },
      ],
      emotionalQuote:
        'Our greatest mistake is thinking we still have plenty of time.',
      emotionalAttribution: 'Life Philosophy',
    },
    solution: {
      sectionLabel: 'Be Proactive',
      sectionTitle: 'ROOTS: A Shield Against Oblivion',
      sectionDescription:
        'Dont wait for your parents to tell their stories; be the one who asks. A "Phygital" journey to help you build your family legacy from afar.',
      steps: [
        {
          title: 'The "Memory Unlocking" Album',
          subtitle: 'A gift of filial piety from abroad',
          description:
            'Send home a premium physical Album. Each page is a space for parents to place old photos and a unique QR code, removing all technology barriers.',
          features: [
            'Elegant design, evoking nostalgia',
            'In-depth emotional prompts system',
            'Easy to use for the elderly',
            'A treasure to be passed through generations',
          ],
        },
        {
          title: 'Smart Storytelling Assistant',
          subtitle: 'Making "I love you" easier to say',
          description:
            'When scanning the QR, parents dont just record; they receive "Storytelling Prompts". We designed scripts to help even the most reserved parents open up naturally.',
          features: [
            'Ice-breaking conversation starters',
            'Follow-up questions to dive deeper into emotions',
            'Minimalist tap-to-talk interface',
            'AI noise cancellation directly in the browser',
          ],
        },
        {
          title: 'Eternal Digital Museum',
          subtitle: 'The greatest asset you will ever own',
          description:
            'You take on the role of the "Curator". Arrange, edit, and store your parents life fragments into a vivid living timeline.',
          features: [
            'Fully customizable timeline by you',
            'AI transcribes voice into written memoirs',
            'Restores old photos into emotional videos',
            'Sharing mode for future generations',
          ],
        },
      ],
    },
    competitive: {
      sectionLabel: 'Your Choice',
      sectionTitle: 'Storing Junk or Preserving Legacy?',
      sectionDescription:
        'We dont create instant messages. We create keepsakes that live forever.',
      rootsTitle: 'ROOTS',
      rootsSubtitle: 'Heritage Preserver',
      othersTitle: 'Communication Apps',
      othersSubtitle: 'Raw Data Storage',
      comparisons: [
        {
          feature: 'Core Value',
          roots: 'Empathy & Deep Connection',
          others: 'Convenience & Speed',
        },
        {
          feature: 'Outcome',
          roots: 'A vivid living memoir',
          others: 'Messy, easily lost chat logs',
        },
        {
          feature: 'Guidance',
          roots: 'Scripts to help parents "open up"',
          others: 'Waiting for random interactions',
        },
        {
          feature: 'Access',
          roots: 'Scan QR, use instantly on Web',
          others: 'Mandatory App install & login',
        },
        {
          feature: 'Physical Element',
          roots: 'Physical Album as a "trigger"',
          others: 'Only superficial digital presence',
        },
        {
          feature: 'AI Features',
          roots: 'Elevating and preserving heritage',
          others: 'Entertainment content suggestions',
        },
      ],
      advantages: [
        {
          title: 'Depth Above All',
          description:
            'While other apps optimize for convenience, we optimize for enduring spiritual values.',
        },
        {
          title: 'Understanding the Cultural Nuance',
          description:
            'We know that Vietnamese parents often struggle to express love. Roots acts as the "narrator" to bridge the two generations.',
        },
        {
          title: 'Sacred Privacy',
          description:
            'Your family’s emotional data is unique. We promise never to commercialize or analyze your personal stories.',
        },
      ],
    },
    tech: {
      sectionLabel: 'Core Features',
      sectionTitle: 'Family Legacy Connection Solution',
      sectionDescription:
        'The perfect combination of traditional physical Albums and modern technology to fully preserve life stories.',
      features: [
        {
          title: 'Phygital Bridge',
          description:
            'Premium physical album with unique QR codes, helping parents easily take photos and record stories with a single touch.',
          status: 'MVP',
        },
        {
          title: 'Memory Management System',
          description:
            'Empowers the child as the "Editor-in-chief" to organize, tag, and add emotions to every fragment of their parents’ memories.',
          status: 'Core',
        },
        {
          title: 'Legacy Timeline',
          description:
            'Customizable timeline interface, connecting scattered stories into a continuous family narrative.',
          status: 'Core',
        },
        {
          title: 'Future Sharing Mode',
          description:
            'Set access for future generations, turning memories into a living "digital will" for children anywhere.',
          status: 'Legacy',
        },
      ],
      marketLabel: 'Opportunity for the Expat Community',
      marketTitle: 'Why the time to act is now',
      metrics: [
        { value: '500k+', label: 'Vietnamese students worldwide' },
        { value: '100%', label: 'Time cannot be reversed' },
        {
          value: '0',
          label: 'Reason to delay any longer',
        },
      ],
      marketText:
        'The Vietnamese expat community is growing and aging rapidly. Every day that passes is a family history page at risk of being lost forever. Don’t let yourself say "I wish I had".',
    },
    finalCta: {
      quoteText: 'Parents dont live forever with us,',
      quoteHighlight: 'but their stories can.',
      visionText:
        'Be the proactive child who holds onto the family warmth. Join ROOTS to start building your parents legacy today.',
      emailPlaceholder: 'Your email address',
      submitButton: 'I want to preserve memories',
      successTitle: 'Thank you for valuing your family!',
      successText:
        'Information about the ROOTS Album will be sent to you soon.',
      secondaryCtas: [
        'Study abroad community partnership',
        'Become a partner',
        'Investor relations',
      ],
    },
    footer: {
      logoSubtext: '(ROOTS)',
      privacyPolicy: 'Legacy Privacy',
      termsOfService: 'Terms of Responsibility',
      contact: 'Expat Student Support',
      madeWith: 'Built with the heartfelt concerns of children living afar',
      inVietnam: 'in Vietnam & France',
      tagline: 'Roots: Go far, to tell it close.',
    },
  },
  vi: {
    navbar: {
      logoSubtext: '(ROOTS)',
      story: 'Tầm nhìn',
      howItWorks: 'Quy trình',
      technology: 'Tính năng nổi bật',
      joinWaitlist: 'Giữ lại ký ức ngay',
      languageLabel: 'Ngôn ngữ',
    },
    hero: {
      tagline: 'Đừng để kỷ niệm trở thành hối tiếc',
      subtitle: '(ROOTS)',
      headlineLine1: 'Dù cách nhau nửa vòng trái đất,',
      headlineHighlight: 'vẫn chạm được vào tâm hồn.',
      description:
        'Biến khoảng cách vạn dặm thành những phút giây thấu hiểu. Chúng tôi giúp du học sinh lưu giữ giọng nói và những chương đời chưa kể của cha mẹ trước khi thời gian xóa nhòa tất cả.',
      primaryButton: 'Bắt đầu hành trình kết nối',
      secondaryButton: 'Phép toán thời gian',
    },
    problem: {
      sectionLabel: 'Sự thật nghiệt ngã',
      sectionTitle: 'Phép toán đau lòng của người xa xứ',
      sectionDescription:
        'Bạn có bao giờ dám tính thử mình còn bao nhiêu cơ hội để thực sự thấu hiểu cha mẹ trước khi quá muộn?',
      cards: [
        {
          title: 'Con số 20 hữu hạn',
          description:
            'Nếu mỗi năm bạn về một lần, bạn có thể chỉ còn đúng 20 lần được ngồi ăn cơm cùng cha mẹ. Mỗi năm trôi qua là một cơ hội vĩnh viễn mất đi.',
          quote:
            'Tôi bàng hoàng nhận ra mình chỉ còn chưa đầy 30 ngày thực sự ở bên cha mẹ trong suốt phần đời còn lại.',
        },
        {
          title: 'Nỗi sợ "Người lạ quen thuộc"',
          description:
            'Zalo vẫn báo tin nhắn, FaceTime vẫn thấy mặt, nhưng bạn dần không còn biết cha mẹ đang thực sự nghĩ gì. Bạn đang mất họ ngay khi họ vẫn còn sống.',
          quote:
            'Sợ nhất là khi trở về, tôi nhận ra mình đã bỏ lỡ cả một chương đời quan trọng nhất của mẹ.',
        },
        {
          title: 'Tiếng vọng trống rỗng',
          description:
            'Các ứng dụng nhắn tin chỉ là công cụ liên lạc nhanh, không phải nơi lưu giữ báu vật. Một ngày nào đó, bạn sẽ khao khát được nghe lại một lời dặn dò, nhưng chỉ còn là im lặng.',
          quote:
            'Lướt lại tin nhắn cũ không giống như được nghe giọng nói ấm áp của cha.',
        },
      ],
      emotionalQuote:
        'Sai lầm lớn nhất của chúng ta là nghĩ rằng mình vẫn còn nhiều thời gian.',
      emotionalAttribution: 'Châm ngôn sống',
    },
    solution: {
      sectionLabel: 'Hãy là người chủ động',
      sectionTitle: 'ROOTS: Lá chắn chống lại sự lãng quên',
      sectionDescription:
        'Đừng đợi cha mẹ kể, hãy là người khơi gợi. Một hành trình "Phygital" giúp bạn kiến tạo di sản gia đình từ xa.',
      steps: [
        {
          title: 'Album "Mở khóa ký ức"',
          subtitle: 'Món quà hiếu kính từ phương xa',
          description:
            'Bạn gửi về nhà một Album vật lý cao cấp. Mỗi trang là một không gian để cha mẹ lồng ảnh cũ và mã QR định danh, giúp xóa bỏ mọi rào cản công nghệ.',
          features: [
            'Thiết kế sang trọng, gợi nhắc hoài niệm',
            'Hệ thống câu hỏi khơi gợi cảm xúc chuyên sâu',
            'Dễ dàng sử dụng cho người cao tuổi',
            'Vật báu lưu truyền qua nhiều thế hệ',
          ],
        },
        {
          title: 'Trợ lý kể chuyện thông minh',
          subtitle: 'Để lời thương không còn khó nói',
          description:
            'Khi quét QR, cha mẹ không chỉ thu âm mà còn nhận được các "Gợi ý kể chuyện". Chúng tôi thiết kế sẵn các kịch bản dẫn dắt giúp những người cha, người mẹ vốn ít bày tỏ tình cảm có thể mở lòng một cách tự nhiên nhất.',
          features: [
            'Gợi ý cách bắt đầu câu chuyện "phá băng"',
            'Câu hỏi phụ dẫn dắt cảm xúc đi sâu hơn',
            'Giao diện chạm-để-nói tối giản',
            'Lọc nhiễu âm thanh AI trực tiếp trên trình duyệt',
          ],
        },
        {
          title: 'Bảo tàng số vĩnh cửu',
          subtitle: 'Tài sản lớn nhất bạn từng sở hữu',
          description:
            'Nơi bạn đóng vai trò "Người giám tuyển". Sắp xếp, biên tập và lưu trữ những mảnh ghép cuộc đời cha mẹ thành một dòng thời gian sống động.',
          features: [
            'Dòng thời gian do bạn tự tay tùy chỉnh',
            'AI chuyển giọng nói thành hồi ký văn bản',
            'Phục dựng ảnh cũ thành video cảm xúc',
            'Chế độ chia sẻ cho thế hệ tương lai',
          ],
        },
      ],
    },
    competitive: {
      sectionLabel: 'Sự lựa chọn của bạn',
      sectionTitle: 'Lưu trữ rác hay Lưu giữ Di sản?',
      sectionDescription:
        'Chúng tôi không tạo ra tin nhắn nhanh. Chúng tôi tạo ra những kỷ vật sống mãi với thời gian.',
      rootsTitle: 'ROOTS',
      rootsSubtitle: 'Người bảo trì di sản',
      othersTitle: 'App giao tiếp',
      othersSubtitle: 'Kho chứa dữ liệu thô',
      comparisons: [
        {
          feature: 'Cốt lõi',
          roots: 'Sự thấu cảm & Gắn kết sâu',
          others: 'Tiện lợi & Nhanh chóng',
        },
        {
          feature: 'Kết quả',
          roots: 'Một cuốn hồi ký sống động',
          others: 'Dòng tin nhắn lộn xộn, dễ mất',
        },
        {
          feature: 'Cách dẫn dắt',
          roots: 'Kịch bản giúp bố mẹ "mở lòng"',
          others: 'Đợi chờ tương tác ngẫu nhiên',
        },
        {
          feature: 'Truy cập',
          roots: 'Quét mã QR, dùng ngay trên Web',
          others: 'Bắt buộc cài App, đăng nhập',
        },
        {
          feature: 'Yếu Tố Vật Lý',
          roots: 'Album vật lý làm "ngòi nổ"',
          others: 'Chỉ kỹ thuật số hời hợt',
        },
        {
          feature: 'Tính Năng AI',
          roots: 'Nâng tầm và bảo tồn di sản',
          others: 'Gợi ý nội dung giải trí',
        },
      ],
      advantages: [
        {
          title: 'Chiều sâu trên hết',
          description:
            'Trong khi các ứng dụng khác tối ưu cho sự tiện lợi, chúng tôi tối ưu cho những giá trị tinh thần trường tồn.',
        },
        {
          title: 'Thấu hiểu tâm lý người Việt',
          description:
            'Chúng tôi hiểu cha mẹ Việt thường ngại nói lời yêu thương. Vì vậy, Roots đóng vai trò là "người dẫn chuyện" để kết nối hai thế hệ.',
        },
        {
          title: 'Quyền riêng tư thiêng liêng',
          description:
            'Dữ liệu cảm xúc của gia đình bạn là duy nhất. Chúng tôi cam kết không bao giờ thương mại hóa hay phân tích câu chuyện của bạn.',
        },
      ],
    },
    tech: {
      sectionLabel: 'Tính năng cốt lõi',
      sectionTitle: 'Giải pháp kết nối di sản gia đình',
      sectionDescription:
        'Sự kết hợp hoàn hảo giữa Album vật lý truyền thống và công nghệ hiện đại, giúp lưu giữ những câu chuyện đời người một cách trọn vẹn nhất.',
      features: [
        {
          title: 'Phygital Bridge',
          description:
            'Album vật lý cao cấp tích hợp mã QR định danh, giúp cha mẹ dễ dàng chụp ảnh và ghi âm kể chuyện chỉ với một cú chạm.',
          status: 'MVP',
        },
        {
          title: 'Hệ thống Quản trị Ký ức',
          description:
            'Cung cấp quyền "Tổng biên tập" cho người con để sắp xếp, gắn nhãn và thêm cảm xúc vào từng mảnh ghép ký ức của cha mẹ.',
          status: 'Core',
        },
        {
          title: 'Legacy Timeline',
          description:
            'Giao diện dòng thời gian tùy chỉnh, ghép nối những đoạn kể chuyện rời rạc thành một mạch truyện xuyên suốt về gia tộc.',
          status: 'Core',
        },
        {
          title: 'Chế độ Chia sẻ Tương lai',
          description:
            'Thiết lập quyền truy cập cho thế hệ mai sau, biến ký ức thành một "di chúc số" sống động cho con cháu ở bất cứ đâu.',
          status: 'Di sản',
        },
      ],
      marketLabel: 'Cơ hội cho cộng đồng xa xứ',
      marketTitle: 'Vì sao bây giờ là lúc phải hành động',
      metrics: [
        { value: '500k+', label: 'Du học sinh Việt Nam toàn cầu' },
        { value: '100%', label: 'Thời gian không thể quay lại' },
        {
          value: '0',
          label: 'Lý do để trì hoãn thêm nữa',
        },
      ],
      marketText:
        'Cộng đồng người Việt xa xứ đang tăng trưởng và già hóa nhanh chóng. Mỗi ngày trôi qua là một trang sử gia đình có nguy cơ mất đi vĩnh viễn. Đừng để bản thân phải nói câu "Giá như".',
    },
    finalCta: {
      quoteText: 'Cha mẹ không sống đời với ta,',
      quoteHighlight: 'nhưng câu chuyện của họ thì có thể.',
      visionText:
        'Hãy là người con chủ động giữ lấy hơi ấm gia đình. Tham gia cùng ROOTS để bắt đầu xây dựng di sản cho cha mẹ ngay hôm nay.',
      emailPlaceholder: 'Địa chỉ email của bạn',
      submitButton: 'Tôi muốn giữ lại ký ức',
      successTitle: 'Cảm ơn bạn đã trân trọng gia đình!',
      successText: 'Thông tin về bộ Album ROOTS sẽ sớm được gửi tới bạn.',
      secondaryCtas: [
        'Hợp tác cộng đồng du học',
        'Trở thành đối tác',
        'Quan hệ nhà đầu tư',
      ],
    },
    footer: {
      logoSubtext: '(ROOTS)',
      privacyPolicy: 'Bảo mật di sản',
      termsOfService: 'Điều khoản trách nhiệm',
      contact: 'Hỗ trợ du học sinh',
      madeWith: 'Xây dựng bằng nỗi trăn trở của những người con xa xứ',
      inVietnam: 'tại Việt Nam & Pháp',
      tagline: 'Roots: Đi thật xa, để kể lại thật gần.',
    },
  },
  fr: {
    navbar: {
      logoSubtext: '(ROOTS)',
      story: 'Notre Vision',
      howItWorks: 'Fonctionnement',
      technology: 'Caractéristiques phare',
      joinWaitlist: 'Préserver les Souvenirs',
      languageLabel: 'Langue',
    },
    hero: {
      tagline: 'Ne laissez pas les souvenirs devenir des regrets',
      subtitle: '(ROOTS)',
      headlineLine1: 'À l’autre bout du monde,',
      headlineHighlight: 'mais les âmes se touchent toujours.',
      description:
        'Transformer des milliers de kilomètres en moments de compréhension. Nous aidons les étudiants internationaux à préserver la voix et les chapitres inédits de leurs parents avant que le temps n’efface tout.',
      primaryButton: 'Commencer le Voyage de Connexion',
      secondaryButton: 'Le Calcul du Temps',
    },
    problem: {
      sectionLabel: 'La Réalité Cruelle',
      sectionTitle: 'Le Calcul Déchirant des Expatriés',
      sectionDescription:
        'Avez-vous déjà osé calculer combien de chances il vous reste réellement pour comprendre vos parents avant qu’il ne soit trop tard ?',
      cards: [
        {
          title: 'Le Chiffre Fini 20',
          description:
            'Si vous rentrez une fois par an, il ne vous reste peut-être que 20 repas à partager avec vos parents. Chaque année qui passe est une opportunité perdue à jamais.',
          quote:
            'J’ai été choqué de réaliser qu’il me restait moins de 30 jours de temps réel avec mes parents pour le reste de leur vie.',
        },
        {
          title: 'La Peur de "l’Étranger Familier"',
          description:
            'Les messages Zalo arrivent, les appels FaceTime se connectent, mais vous perdez peu à peu le fil de ce que vos parents pensent vraiment. Vous les perdez alors qu’ils sont encore là.',
          quote:
            'Le plus effrayant, c’est de rentrer à la maison et de réaliser que j’ai manqué tout un chapitre vital de la vie de ma mère.',
        },
        {
          title: 'L’Écho Vide',
          description:
            'Les applications de messagerie ne sont que des outils de communication rapide, pas des coffres aux trésors. Un jour, vous rêverez d’entendre à nouveau un conseil, mais il n’y aura que le silence.',
          quote:
            'Faire défiler de vieux SMS n’est pas la même chose que d’entendre la chaleur dans la voix de mon père.',
        },
      ],
      emotionalQuote:
        'Notre plus grande erreur est de penser que nous avons encore beaucoup de temps.',
      emotionalAttribution: 'Philosophie de Vie',
    },
    solution: {
      sectionLabel: 'Soyez Proactif',
      sectionTitle: 'ROOTS : Un Bouclier Contre l’Oubli',
      sectionDescription:
        'N’attendez pas que vos parents racontent leurs histoires ; soyez celui qui demande. Un voyage "Phygital" pour vous aider à construire votre héritage familial à distance.',
      steps: [
        {
          title: 'L’Album "Déverrouilleur de Souvenirs"',
          subtitle: 'Un cadeau de piété filiale venu d’ailleurs',
          description:
            'Envoyez à la maison un album physique premium. Chaque page est un espace pour que les parents y placent de vieilles photos et un code QR unique, supprimant toutes les barrières technologiques.',
          features: [
            'Design élégant, évoquant la nostalgie',
            'Système de questions suggestives approfondies',
            'Facile à utiliser pour les personnes âgées',
            'Un trésor à transmettre de génération en génération',
          ],
        },
        {
          title: 'Assistant Narratif Intelligent',
          subtitle: 'Pour que les mots d’amour soient plus faciles à dire',
          description:
            'En scannant le QR, les parents ne font pas qu’enregistrer ; ils reçoivent des "Guides Narratifs". Nous avons conçu des scénarios pour aider les parents les plus réservés à s’ouvrir naturellement.',
          features: [
            'Amorceurs de conversation pour "briser la glace"',
            'Questions de relance pour approfondir les émotions',
            'Interface minimaliste "appuyer pour parler"',
            'Suppression du bruit par IA directement dans le navigateur',
          ],
        },
        {
          title: 'Musée Numérique Éternel',
          subtitle: 'Le plus grand atout que vous posséderez jamais',
          description:
            'Vous jouez le rôle de "Conservateur". Organisez, éditez et stockez les fragments de vie de vos parents dans une chronologie vivante et dynamique.',
          features: [
            'Chronologie entièrement personnalisable par vous',
            'L’IA transcrit la voix en mémoires écrites',
            'Restauration de vieilles photos en vidéos émotionnelles',
            'Mode de partage pour les générations futures',
          ],
        },
      ],
    },
    competitive: {
      sectionLabel: 'Votre Choix',
      sectionTitle: 'Stocker des Déchets ou Préserver un Héritage ?',
      sectionDescription:
        'Nous ne créons pas de messages instantanés. Nous créons des souvenirs qui vivent éternellement.',
      rootsTitle: 'ROOTS',
      rootsSubtitle: 'Préservateur d’Héritage',
      othersTitle: 'Apps de Communication',
      othersSubtitle: 'Stockage de Données Brutes',
      comparisons: [
        {
          feature: 'Valeur Fondamentale',
          roots: 'Empathie & Connexion Profonde',
          others: 'Commodité & Rapidité',
        },
        {
          feature: 'Résultat',
          roots: 'Un mémoire vivant et vibrant',
          others: 'Historiques de chat désordonnés et perdus',
        },
        {
          feature: 'Guidage',
          roots: 'Scénarios pour aider les parents à "s’ouvrir"',
          others: 'Attente d’interactions aléatoires',
        },
        {
          feature: 'Accès',
          roots: 'Scanner le QR, utiliser instantanément sur le Web',
          others: 'Installation d’App et connexion obligatoires',
        },
        {
          feature: 'Élément Physique',
          roots: 'Album physique comme "déclencheur"',
          others: 'Présence numérique superficielle uniquement',
        },
        {
          feature: 'Fonctions IA',
          roots: 'Sublimer et préserver l’héritage',
          others: 'Suggestions de contenu de divertissement',
        },
      ],
      advantages: [
        {
          title: 'La Profondeur Avant Tout',
          description:
            'Alors que d’autres apps optimisent pour la commodité, nous optimisons pour les valeurs spirituelles durables.',
        },
        {
          title: 'Comprendre les Nuances Culturelles',
          description:
            'Nous savons que les parents vietnamiens ont souvent du mal à exprimer leur amour. Roots joue le rôle de "narrateur" pour lier les deux générations.',
        },
        {
          title: 'Confidentialité Sacrée',
          description:
            'Les données émotionnelles de votre famille sont uniques. Nous promettons de ne jamais commercialiser ni analyser vos histoires personnelles.',
        },
      ],
    },
    tech: {
      sectionLabel: 'Fonctionnalités Clés',
      sectionTitle: 'Solution de Connexion à l’Héritage Familial',
      sectionDescription:
        'La combinaison parfaite entre albums physiques traditionnels et technologie moderne pour préserver pleinement les histoires de vie.',
      features: [
        {
          title: 'Pont Phygital',
          description:
            'Album physique premium avec codes QR uniques, permettant aux parents de prendre des photos et d’enregistrer des histoires d’un seul geste.',
          status: 'MVP',
        },
        {
          title: 'Système de Gestion de Mémoire',
          description:
            'Donne à l’enfant le rôle de "Rédacteur en chef" pour organiser, étiqueter et ajouter des émotions à chaque fragment de souvenir.',
          status: 'Core',
        },
        {
          title: 'Chronologie de l’Héritage',
          description:
            'Interface chronologique personnalisable, reliant les histoires éparpillées en un récit familial continu.',
          status: 'Core',
        },
        {
          title: 'Mode de Partage Futur',
          description:
            'Définissez l’accès pour les générations futures, transformant les souvenirs en un "testament numérique" vivant pour les petits-enfants partout.',
          status: 'Héritage',
        },
      ],
      marketLabel: 'Opportunité pour la Communauté Expatriée',
      marketTitle: 'Pourquoi c’est le moment d’agir',
      metrics: [
        { value: '500k+', label: 'Étudiants vietnamiens dans le monde' },
        { value: '100%', label: 'Le temps ne peut pas faire marche arrière' },
        {
          value: '0',
          label: 'Raison d’attendre plus longtemps',
        },
      ],
      marketText:
        'La communauté expatriée vietnamienne grandit et vieillit rapidement. Chaque jour qui passe est une page de l’histoire familiale qui risque de disparaître à jamais. Ne vous laissez pas dire "Si j’avais su".',
    },
    finalCta: {
      quoteText: 'Les parents ne vivent pas éternellement avec nous,',
      quoteHighlight: 'mais leurs histoires le peuvent.',
      visionText:
        'Soyez l’enfant proactif qui préserve la chaleur familiale. Rejoignez ROOTS pour commencer à bâtir l’héritage de vos parents dès aujourd’hui.',
      emailPlaceholder: 'Votre adresse e-mail',
      submitButton: 'Je veux préserver les souvenirs',
      successTitle: 'Merci de valoriser votre famille !',
      successText:
        'Les informations sur l’Album ROOTS vous seront envoyées prochainement.',
      secondaryCtas: [
        'Partenariats communauté étudiante',
        'Devenir partenaire',
        'Relations investisseurs',
      ],
    },
    footer: {
      logoSubtext: '(ROOTS)',
      privacyPolicy: 'Confidentialité de l’Héritage',
      termsOfService: 'Conditions de Responsabilité',
      contact: 'Soutien aux Étudiants Expats',
      madeWith:
        'Conçu avec les préoccupations sincères des enfants vivant loin',
      inVietnam: 'au Vietnam & en France',
      tagline: 'Roots : Partir loin, pour raconter de près.',
    },
  },
}

export type Locale = 'en' | 'vi' | 'fr';

export const locales: Locale[] = ['en', 'vi', 'fr'];

type NavbarTranslations = {
  navbar: {
    logoSubtext: string;
    story: string;
    howItWorks: string;
    technology: string;
    joinWaitlist: string;
    languageLabel: string;
  };
  hero: {
    tagline: string;
    subtitle: string;
    headlineLine1: string;
    headlineHighlight: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  problem: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDescription: string;
    cards: Array<{
      title: string;
      description: string;
      quote: string;
    }>;
    emotionalQuote: string;
    emotionalAttribution: string;
  };
  solution: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDescription: string;
    steps: Array<{
      title: string;
      subtitle: string;
      description: string;
      features: string[];
    }>;
  };
  competitive: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDescription: string;
    rootsTitle: string;
    rootsSubtitle: string;
    othersTitle: string;
    othersSubtitle: string;
    comparisons: Array<{
      feature: string;
      roots: string;
      others: string;
    }>;
    advantages: Array<{
      title: string;
      description: string;
    }>;
  };
  tech: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDescription: string;
    features: Array<{
      title: string;
      description: string;
      status: string;
    }>;
    marketLabel: string;
    marketTitle: string;
    metrics: Array<{
      value: string;
      label: string;
    }>;
    marketText: string;
  };
  finalCta: {
    quoteText: string;
    quoteHighlight: string;
    visionText: string;
    emailPlaceholder: string;
    submitButton: string;
    successTitle: string;
    successText: string;
    secondaryCtas: string[];
  };
  footer: {
    logoSubtext: string;
    privacyPolicy: string;
    termsOfService: string;
    contact: string;
    madeWith: string;
    inVietnam: string;
    tagline: string;
  };
};

export type TranslationSchema = NavbarTranslations;

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    navbar: {
      logoSubtext: '(ROOT)',
      story: 'The Story',
      howItWorks: 'How It Works',
      technology: 'Technology',
      joinWaitlist: 'Join Waitlist',
      languageLabel: 'Language',
    },
    hero: {
      tagline: 'A Digital Museum for Family Heritage',
      subtitle: '(ROOT)',
      headlineLine1: 'Memories are not just to be remembered,',
      headlineHighlight: 'but to be relived.',
      description:
        'The first digital museum for family heritage in Vietnam. Preserve the voices, stories, and wisdom of your parents before they become whispers of the past.',
      primaryButton: 'Explore the Vision',
      secondaryButton: 'Watch Our Story',
    },
    problem: {
      sectionLabel: 'The Emotional Gap',
      sectionTitle: "What We're Losing",
      sectionDescription:
        'Every day, precious memories slip away. The stories that shaped us, the voices that comforted us, the wisdom that guided us - all fading into silence.',
      cards: [
        {
          title: 'Surface-Level Connection',
          description:
            'Daily calls exist, but emotional connection remains shallow. "Did you eat?" "How are you?" - the same questions, day after day.',
          quote: "We talk every day, yet I barely know my father's dreams.",
        },
        {
          title: 'Stories Fading Away',
          description:
            'Family stories, life lessons, and precious memories are being lost with each passing day. Once gone, they can never be recovered.',
          quote: "My grandmother's recipes, her childhood stories... all lost.",
        },
        {
          title: 'Tools, Not Treasures',
          description:
            "Zalo, Facebook - they're communication tools, not legacy preservers. Your family's heritage deserves more than a chat history.",
          quote:
            "Scrolling through old messages isn't the same as hearing her voice.",
        },
      ],
      emotionalQuote:
        'The greatest tragedy is not death, but what dies inside us while we live.',
      emotionalAttribution: 'Norman Cousins',
    },
    solution: {
      sectionLabel: 'The Phygital System',
      sectionTitle: 'Where Physical Meets Digital',
      sectionDescription:
        'A seamless three-step journey that bridges generations through thoughtful design and intuitive technology.',
      steps: [
        {
          title: 'Roots Cards',
          subtitle: 'Physical Connection',
          description:
            'A beautifully crafted deck of 50 guided questions designed to unlock natural storytelling between family members. No screens, no pressure - just meaningful conversations.',
          features: [
            '50 thoughtfully curated prompts',
            'Designed for all ages',
            'Bilingual: Vietnamese & English',
            'Premium quality materials',
          ],
        },
        {
          title: 'Roots App',
          subtitle: 'Digital Capture',
          description:
            'Scan the QR code on each card to record precious moments. Voice memos, video stories, or simple text - capture memories in the most natural way.',
          features: [
            'Simple QR scan to record',
            'Voice & video capture',
            'No technical skills needed',
            'Works offline',
          ],
        },
        {
          title: 'Family Vault',
          subtitle: 'Legacy Preserved',
          description:
            "AI-powered timeline that organizes your family's stories into a beautiful digital autobiography. Search, relive, and share across generations.",
          features: [
            'AI-organized timeline',
            'Voice-to-text transcription',
            'Photo enhancement',
            'Secure family sharing',
          ],
        },
      ],
    },
    competitive: {
      sectionLabel: 'Why ROOTS',
      sectionTitle: 'Different By Design',
      sectionDescription:
        "We're not competing with Zalo or Facebook. We're creating an entirely new category: digital legacy preservation.",
      rootsTitle: 'ROOTS',
      rootsSubtitle: 'Legacy Platform',
      othersTitle: 'Zalo / Facebook',
      othersSubtitle: 'Communication Apps',
      comparisons: [
        {
          feature: 'Purpose',
          roots: 'Legacy & Heritage Preservation',
          others: 'Communication & Social',
        },
        {
          feature: 'Depth',
          roots: 'Meaningful life stories',
          others: 'Daily updates & news',
        },
        {
          feature: 'Format',
          roots: 'Guided storytelling prompts',
          others: 'Free-form messaging',
        },
        {
          feature: 'Privacy',
          roots: 'Family-only, GDPR-compliant',
          others: 'Public or semi-public',
        },
        {
          feature: 'Physical Element',
          roots: 'Premium card deck included',
          others: 'Digital only',
        },
        {
          feature: 'AI Features',
          roots: 'Story organization & enhancement',
          others: 'Ads & recommendations',
        },
      ],
      advantages: [
        {
          title: 'Depth Over Convenience',
          description:
            'While other apps optimize for quick messages, we optimize for meaningful conversations that last generations.',
        },
        {
          title: 'Elder-Friendly Design',
          description:
            'Physical cards remove the technology barrier, making it easy for parents and grandparents to participate naturally.',
        },
        {
          title: 'Privacy-First Architecture',
          description:
            "Your family's emotional data is sacred. We never monetize, analyze, or share your stories. Ever.",
        },
      ],
    },
    tech: {
      sectionLabel: 'For Builders & Investors',
      sectionTitle: 'Built for Scale',
      sectionDescription:
        'Modern technology stack designed for security, scalability, and seamless user experience across generations.',
      features: [
        {
          title: 'Zalo Mini App (MVP)',
          description:
            'Starting where your family already is. No new app downloads needed for initial adoption.',
          status: 'Phase 1',
        },
        {
          title: 'Native Mobile App',
          description:
            'Full-featured iOS and Android apps with offline support and advanced features.',
          status: 'Phase 2',
        },
        {
          title: 'Voice-to-Story AI',
          description:
            'Automatically transcribes voice recordings into beautifully formatted stories.',
          status: 'AI-Powered',
        },
        {
          title: 'Photo Enhancement',
          description:
            'AI reconstruction of old, damaged photos into vivid, emotional video memories.',
          status: 'AI-Powered',
        },
        {
          title: 'Smart Timeline',
          description:
            "AI-organized chronological view of your family's stories, searchable and browsable.",
          status: 'AI-Powered',
        },
        {
          title: 'Enterprise Security',
          description:
            'End-to-end encryption, GDPR compliance, and family-controlled access permissions.',
          status: 'Core',
        },
      ],
      marketLabel: 'Market Opportunity',
      marketTitle: 'Why Now Is the Perfect Time',
      metrics: [
        { value: '6M+', label: 'Vietnamese Diaspora Globally' },
        { value: '89%', label: 'Want to Preserve Family Stories' },
        { value: '67%', label: 'Regret Not Recording Parents' },
      ],
      marketText:
        'The Vietnamese diaspora is growing, aging, and increasingly aware of the importance of preserving their heritage. The time to act is now - before another generation of stories is lost.',
    },
    finalCta: {
      quoteText: 'We are not just building a product.',
      quoteHighlight: 'We are building a legacy.',
      visionText:
        'Join thousands of Vietnamese families around the world who are choosing to preserve what matters most - the voices, stories, and wisdom of those they love.',
      emailPlaceholder: 'Enter your email',
      submitButton: 'Join the Journey',
      successTitle: 'Thank you for joining us!',
      successText: "We'll be in touch soon with updates on ROOTS.",
      secondaryCtas: [
        'Download Press Kit',
        'Partner With Us',
        'Investor Relations',
      ],
    },
    footer: {
      logoSubtext: '(ROOT)',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      contact: 'Contact',
      madeWith: 'Made with',
      inVietnam: 'in Vietnam',
      tagline: 'Preserving yesterday, for tomorrow.',
    },
  },
  vi: {
    navbar: {
      logoSubtext: '(ROOTS)',
      story: 'Tầm nhìn',
      howItWorks: 'Quy trình',
      technology: 'Công nghệ AI',
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
            '50 câu hỏi "đắt giá" khơi mở tâm hồn',
            'Dễ dàng sử dụng cho người cao tuổi',
            'Vật báu lưu truyền qua nhiều thế hệ',
          ],
        },
        {
          title: 'Thu âm trực tiếp tức thì',
          subtitle: 'Kể chuyện chỉ với một lần quét',
          description:
            'Cha mẹ chỉ cần quét mã QR trên Album để mở giao diện thu âm trực tiếp trên trình duyệt. Không cần cài đặt, không cần đăng ký phức tạp - chỉ cần chạm và nói.',
          features: [
            'Chụp ảnh và thu âm ngay trên trình duyệt',
            'Giao diện tối giản cho người già',
            'Công nghệ lọc nhiễu âm thanh AI trực tiếp',
            'Tự động đồng bộ hóa vào bảo tàng số của bạn',
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
          feature: 'Tính chủ động',
          roots: 'Con dẫn dắt bố mẹ kể chuyện',
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
          title: 'Xóa bỏ rào cản thế hệ',
          description:
            'Album vật lý và Web-record giúp cha mẹ tham gia ngay lập tức mà không cần biết dùng ứng dụng phức tạp.',
        },
        {
          title: 'Quyền riêng tư thiêng liêng',
          description:
            'Dữ liệu cảm xúc của gia đình bạn là duy nhất. Chúng tôi cam kết không bao giờ thương mại hóa hay phân tích câu chuyện của bạn.',
        },
      ],
    },
    tech: {
      sectionLabel: 'Công nghệ phục vụ trái tim',
      sectionTitle: 'Xây dựng cho sự vĩnh cửu',
      sectionDescription:
        'Nền tảng hiện đại giúp tiếng nói của cha mẹ vang vọng đến 50 năm sau và xa hơn nữa.',
      features: [
        {
          title: 'Hệ thống Web-Recording trực tiếp',
          description:
            'Công nghệ thu âm trên nền tảng web (WebRTC) tương thích hoàn hảo với mọi trình duyệt di động.',
          status: 'Dành cho Cha Mẹ',
        },
        {
          title: 'Hệ quản trị Di sản (Dashboard)',
          description:
            'Công cụ dành cho du học sinh để sắp xếp, chú thích và quản lý bảo tàng gia đình từ xa.',
          status: 'Dành cho Con',
        },
        {
          title: 'AI Storyteller',
          description:
            'Tự động chuyển bản ghi âm thành những trang hồi ký được trình bày đẹp mắt.',
          status: 'AI',
        },
        {
          title: 'Phục dựng hình ảnh',
          description:
            'Tái tạo ảnh cũ hư tổn thành những thước phim kỷ niệm sống động.',
          status: 'AI',
        },
        {
          title: 'Legacy Transfer',
          description:
            'Cơ chế chuyển giao quyền thừa kế bảo tàng số cho thế hệ mai sau.',
          status: 'Bảo mật',
        },
        {
          title: 'Mã hóa đầu cuối',
          description:
            'Đảm bảo di sản gia đình chỉ thuộc về những người được phép truy cập.',
          status: 'Cốt Lõi',
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
      logoSubtext: '(RACINES)',
      story: 'Histoire',
      howItWorks: 'Comment Ça Marche',
      technology: 'Technologie',
      joinWaitlist: "Rejoindre La Liste D'Attente",
      languageLabel: 'Langue',
    },
    hero: {
      tagline: 'Un Musee Numerique Pour Le Patrimoine Familial',
      subtitle: '(RACINES)',
      headlineLine1:
        'Les souvenirs ne sont pas faits seulement pour etre gardes,',
      headlineHighlight: 'mais pour etre revus.',
      description:
        "Le premier musee numerique du patrimoine familial au Vietnam. Preservez les voix, les histoires et la sagesse de vos parents avant qu'elles ne deviennent des murmures du passe.",
      primaryButton: 'Explorer La Vision',
      secondaryButton: 'Voir Notre Histoire',
    },
    problem: {
      sectionLabel: 'Le Fossé Emotionnel',
      sectionTitle: 'Ce Que Nous Perdons',
      sectionDescription:
        'Chaque jour, des souvenirs precieux disparaissent. Les histoires qui nous ont formes, les voix qui nous ont consoles, la sagesse qui nous a guides - tout s efface dans le silence.',
      cards: [
        {
          title: 'Connexion Superficielle',
          description:
            'Les appels quotidiens existent, mais le lien emotionnel reste faible. "Tu as mange ?" "Comment vas-tu ?" - les memes questions, jour apres jour.',
          quote:
            'Nous parlons chaque jour, mais je connais a peine les reves de mon pere.',
        },
        {
          title: 'Histoires Qui S Effacent',
          description:
            'Les histoires de famille, les lecons de vie et les souvenirs precieux se perdent de jour en jour. Une fois perdus, ils ne reviennent jamais.',
          quote:
            'Les recettes de ma grand-mere, ses histoires d enfance... tout est perdu.',
        },
        {
          title: 'Des Outils, Pas Des Tresors',
          description:
            'Zalo et Facebook sont des outils de communication, pas des gardiens d heritage. Le patrimoine de votre famille merite plus qu un historique de messages.',
          quote:
            'Faire defiler de vieux messages ne remplace pas le son de sa voix.',
        },
      ],
      emotionalQuote:
        'La plus grande tragedie n est pas la mort, mais ce qui meurt en nous pendant que nous vivons.',
      emotionalAttribution: 'Norman Cousins',
    },
    solution: {
      sectionLabel: 'Le Systeme Phygital',
      sectionTitle: 'La Rencontre Du Physique Et Du Numerique',
      sectionDescription:
        'Un parcours fluide en trois etapes qui relie les generations grace a un design attentionne et une technologie intuitive.',
      steps: [
        {
          title: 'Cartes Roots',
          subtitle: 'Connexion Physique',
          description:
            'Un jeu de 50 questions guidees, soigneusement concu pour declencher un storytelling naturel entre les membres de la famille. Aucun ecran, aucune pression - seulement des conversations profondes.',
          features: [
            '50 questions soigneusement selectionnees',
            'Concu pour tous les ages',
            'Bilingue: vietnamien & anglais',
            'Materiaux premium',
          ],
        },
        {
          title: 'Application Roots',
          subtitle: 'Capture Numerique',
          description:
            'Scannez le QR code de chaque carte pour enregistrer des moments precieux. Memo vocal, video ou texte - capturez les souvenirs de la facon la plus naturelle.',
          features: [
            'Scan QR simple pour enregistrer',
            'Capture vocale et video',
            'Aucune competence technique requise',
            'Fonctionne hors ligne',
          ],
        },
        {
          title: 'Coffre De Famille',
          subtitle: 'Heritage Preserve',
          description:
            'Une chronologie pilotee par l IA organise les histoires de votre famille en une magnifique autobiographie numerique. Recherchez, revivez et partagez entre generations.',
          features: [
            'Chronologie organisee par IA',
            'Transcription voix vers texte',
            'Amelioration photo',
            'Partage familial securise',
          ],
        },
      ],
    },
    competitive: {
      sectionLabel: 'Pourquoi ROOTS',
      sectionTitle: 'Concu Pour Etre Different',
      sectionDescription:
        'Nous ne concurrencons pas Zalo ou Facebook. Nous creons une categorie entierement nouvelle: la preservation d heritage numerique.',
      rootsTitle: 'ROOTS',
      rootsSubtitle: 'Plateforme D Heritage',
      othersTitle: 'Zalo / Facebook',
      othersSubtitle: 'Applications De Communication',
      comparisons: [
        {
          feature: 'Objectif',
          roots: 'Preservation du patrimoine familial',
          others: 'Communication & social',
        },
        {
          feature: 'Profondeur',
          roots: 'Histoires de vie significatives',
          others: 'Nouvelles et mises a jour quotidiennes',
        },
        {
          feature: 'Format',
          roots: 'Prompts guides de storytelling',
          others: 'Messagerie libre',
        },
        {
          feature: 'Confidentialite',
          roots: 'Familial uniquement, conforme au RGPD',
          others: 'Public ou semi-public',
        },
        {
          feature: 'Element Physique',
          roots: 'Jeu de cartes premium inclus',
          others: 'Numerique uniquement',
        },
        {
          feature: 'Fonctionnalites IA',
          roots: 'Organisation et enrichissement des histoires',
          others: 'Publicites et recommandations',
        },
      ],
      advantages: [
        {
          title: 'La Profondeur Avant La Commodite',
          description:
            'Alors que d autres applications optimisent les messages rapides, nous optimisons les conversations significatives qui traversent les generations.',
        },
        {
          title: 'Concu Pour Les Aines',
          description:
            'Les cartes physiques suppriment la barriere technologique et permettent aux parents et grands-parents de participer naturellement.',
        },
        {
          title: 'Architecture Axee Sur La Confidentialite',
          description:
            'Les donnees emotionnelles de votre famille sont sacrees. Nous ne monetisons, n analysons et ne partageons jamais vos histoires.',
        },
      ],
    },
    tech: {
      sectionLabel: 'Pour Les Createurs Et Investisseurs',
      sectionTitle: 'Concu Pour Passer A L Echelle',
      sectionDescription:
        'Une stack technologique moderne concue pour la securite, l evolutivite et une experience fluide entre les generations.',
      features: [
        {
          title: 'Mini App Zalo (MVP)',
          description:
            'Nous commençons la ou votre famille est deja. Aucun nouveau telechargement requis pour l adoption initiale.',
          status: 'Phase 1',
        },
        {
          title: 'Application Mobile Native',
          description:
            'Applications iOS et Android completes avec mode hors ligne et fonctionnalites avancees.',
          status: 'Phase 2',
        },
        {
          title: 'IA Voix Vers Histoire',
          description:
            'Transcrit automatiquement les enregistrements vocaux en histoires joliment formatees.',
          status: 'IA',
        },
        {
          title: 'Amelioration Des Photos',
          description:
            'Reconstruction IA des anciennes photos abimees en souvenirs video vivants et emotionnels.',
          status: 'IA',
        },
        {
          title: 'Chronologie Intelligente',
          description:
            'Vue chronologique organisee par IA des histoires familiales, facile a rechercher et parcourir.',
          status: 'IA',
        },
        {
          title: 'Securite Entreprise',
          description:
            'Chiffrement de bout en bout, conformite RGPD et permissions controlees par la famille.',
          status: 'Noyau',
        },
      ],
      marketLabel: 'Opportunite De Marche',
      marketTitle: 'Pourquoi Le Moment Est Ideal',
      metrics: [
        { value: '6M+', label: 'Diaspora vietnamienne mondiale' },
        {
          value: '89%',
          label: 'Souhaitent preserver les histoires familiales',
        },
        {
          value: '67%',
          label: 'Regrettent de ne pas avoir enregistre leurs parents',
        },
      ],
      marketText:
        'La diaspora vietnamienne grandit, vieillit et prend de plus en plus conscience de l importance de preserver son heritage. Il est temps d agir - avant qu une autre generation d histoires ne disparaisse.',
    },
    finalCta: {
      quoteText: 'Nous ne construisons pas seulement un produit.',
      quoteHighlight: 'Nous construisons un heritage.',
      visionText:
        'Rejoignez des milliers de familles vietnamiennes dans le monde qui choisissent de preserver l essentiel - les voix, les histoires et la sagesse de ceux qu elles aiment.',
      emailPlaceholder: 'Entrez votre email',
      submitButton: 'Rejoindre Le Voyage',
      successTitle: 'Merci de nous rejoindre !',
      successText:
        'Nous vous contacterons bientot avec des nouvelles de ROOTS.',
      secondaryCtas: [
        'Telecharger Le Press Kit',
        'Devenir Partenaire',
        'Relations Investisseurs',
      ],
    },
    footer: {
      logoSubtext: '(RACINES)',
      privacyPolicy: 'Politique De Confidentialite',
      termsOfService: 'Conditions D Utilisation',
      contact: 'Contact',
      madeWith: 'Cree avec',
      inVietnam: 'au Vietnam',
      tagline: 'Preserver hier, pour demain.',
    },
  },
};

export const heroTranslations = {
  en: {
    meta: {
      code: 'AD // CONCEPT BRIEFING',
      location: 'AMMAN, JORDAN',
      status: 'CONCEPTUAL PROPOSAL',
    },
    nav: {
      brandName: 'AMMAN DOME',
      brandSub: 'ARCHITECTURAL & SMART-COMMERCE CONCEPT',
      links: [
        { id: '01', label: 'Vision', href: '#vision' },
        { id: '02', label: 'Architecture', href: '#top' },
        { id: '03', label: 'Experiences', href: '#experiences' },
        { id: '04', label: 'Merchant OS', href: '#merchant-os' },
      ],
      cta: 'Executive Briefing',
      langToggle: 'العربية',
    },
    hero: {
      eyebrow: 'AMMAN, JORDAN • CONCEPTUAL DESTINATION',
      headlineLine1: 'The Future of',
      headlineItalic: 'Immersive',
      headlineLine2: 'Commerce.',
      description:
        'A proposed architectural landmark in Amman uniting biophilic geodesic domes, next-generation entertainment, and intelligent retail.',
      primaryCta: 'Explore Experiences',
      secondaryCta: 'Project Vision',
      robotGreeting: 'WELCOME TO AMMAN DOME',
      robotSub: 'Interactive 3D Guide • Hover or tap to wave',
      stakeholderLabel:
        'CONCEPTUAL PRESENTATION FOR STRATEGIC PARTNERS, INVESTORS, TENANTS & DIPLOMATIC COOPERATION',
    },
    editorialPrelude: {
      index: '01 // EXECUTIVE THESIS',
      tag: 'ORIGINAL ARCHITECTURAL PERSPECTIVE',
      headingRegular: 'Designed as an architectural bridge between',
      headingItalic: 'Jordanian heritage and future commerce.',
      body1:
        'Amman Dome is envisioned not merely as a conventional shopping center, but as an integrated architectural, entertainment, and technological ecosystem. By combining enduring stone geometry with twin geodesic glass domes, the project proposes a landmark destination for Amman.',
      body2:
        'Presented as a conceptual briefing for institutional investors, prospective anchor tenants, engineering partners, and bilateral commercial cooperation with the Chinese Embassy.',
      pillars: [
        {
          num: 'I',
          title: 'Iconic Twin-Dome Architecture',
          text: 'Uniting a primary biophilic glass dome, a cylindrical sky-tunnel, and sculpted stone louver wings.',
        },
        {
          num: 'II',
          title: 'Next-Gen Visitor Experiences',
          text: 'Proposed VR attractions, esports competition arenas, IMAX dome cinema, hologram rooms, and hands-free shopping.',
        },
        {
          num: 'III',
          title: 'Smarter Business Operations',
          text: 'Conceptual shared logistics and operational tools designed to streamline tenant management.',
        },
      ],
    },
    experiences: {
      index: '03 // EXPERIENCES JOURNEY',
      conceptBadge: 'PROPOSED CONCEPTUAL ATTRACTIONS • NON-OPERATIONAL BRIEFING',
      visualBadge: 'CONCEPTUAL ARCHITECTURAL VISUALIZATION',
      spatialBadge: '3D SPATIAL STAGE PREVIEW',
      headingRegular: 'Three immersive realms guided by',
      headingItalic: 'spatial architecture.',
      subtitle:
        'Scroll through the continuous conceptual journey inside Amman Dome—from kinetic virtual reality simulations and competitive esports arenas to volumetric attractions beneath the main geodesic canopy.',
      scrollHint: 'SCROLL TO TRANSITION ZONES OR SELECT ANY ATTRACTION',
      locatorTitle: 'ARCHITECTURAL ZONE LOCATOR',
      robotGuidePrefix: '3D GUIDE //',
      zones: [
        {
          id: 'vr-world',
          num: '01',
          code: 'ZONE 01 // VR WORLD',
          navLabel: 'VR World',
          titleRegular: 'VR World:',
          titleItalic: 'Kinetic Simulation.',
          robotStatus: 'TELEMETRY & MOTION CALIBRATION',
          domeSector: 'West Louver Wing & Atrium Concourse • Proposed Concept',
          locatorCoords: { x: 26, y: 56 },
          summary:
            'A proposed suite of full-body virtual reality simulators combining multi-axis motion platforms, directional airflow, and tactile telemetry.',
          attractions: [
            {
              code: 'VR — 01',
              title: 'VR Car Racing',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/01-vr-car-racing.jpg',
              description:
                'Hydraulic multi-axis cockpit simulators featuring force-feedback steering, pedal load cells, and synchronized squad racing circuits.',
            },
            {
              code: 'VR — 02',
              title: 'VR Gaming',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/02-vr-gaming.jpg',
              description:
                'Untethered free-roam spatial gaming bays equipped with optical motion tracking and cooperative multiplayer tactile arenas.',
            },
            {
              code: 'VR — 03',
              title: 'VR Paragliding',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/03-vr-paragliding.jpg',
              description:
                'Suspended aerial canopy rigs with variable wind-tunnel airflow simulating thermal flight across panoramic landscapes.',
            },
            {
              code: 'VR — 04',
              title: 'VR Surfing',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/04-vr-surfing.jpg',
              description:
                'Gyroscopic wave-pitch balance platforms paired with responsive carve resistance and spatial ocean acoustics.',
            },
          ],
        },
        {
          id: 'gaming-esports',
          num: '02',
          code: 'ZONE 02 // GAMING & ESPORTS',
          navLabel: 'Gaming & Esports',
          titleRegular: 'Gaming &',
          titleItalic: 'Esports Arena.',
          robotStatus: 'ARENA BROADCAST & TOURNAMENT MODE',
          domeSector: 'Central Cylindrical Sky-Tunnel • Proposed Concept',
          locatorCoords: { x: 52, y: 49 },
          summary:
            'A proposed two-level digital competition hub uniting a social interactive video game hall with a tiered tournament amphitheater.',
          attractions: [
            {
              code: 'GE — 01',
              title: 'Video Game Hall',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/05-video-game-hall.jpg',
              description:
                'Next-generation interactive arcade concourse featuring high-refresh gaming pods, rhythm stages, and social lounge bays.',
            },
            {
              code: 'GE — 02',
              title: 'Digital Competition Arena',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/06-esports-digital-arena.jpg',
              description:
                'Tiered esports colosseum inside the Dome complex with acoustic glass team booths, overhead LED telemetry rings, and live spectator seating.',
            },
          ],
        },
        {
          id: 'immersive-attractions',
          num: '03',
          code: 'ZONE 03 // IMMERSIVE ATTRACTIONS',
          navLabel: 'Immersive Attractions',
          titleRegular: 'Immersive',
          titleItalic: 'Dome Attractions.',
          robotStatus: 'VOLUMETRIC & DOME PROJECTION MODE',
          domeSector: 'Primary Geodesic Glass Dome • Proposed Concept',
          locatorCoords: { x: 74, y: 38 },
          summary:
            'Proposed monumental experiential chambers anchored within the primary Dome—blending interactive science discovery, laser IMAX cinema, and holographic theater.',
          attractions: [
            {
              code: 'IA — 01',
              title: 'Immersive Science Room',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/07-immersive-science-room.jpg',
              description:
                'Interactive 360° astrophysics, climate, and biophilic discovery gallery with motion-reactive projection surfaces.',
            },
            {
              code: 'IA — 02',
              title: 'IMAX Cinema Inside the Main Dome',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/08-imax-dome-cinema.jpg',
              description:
                'Acoustic-isolated large-format laser projection theater architecturally suspended inside the primary geodesic dome structure.',
            },
            {
              code: 'IA — 03',
              title: 'Hologram Rooms',
              conceptTag: 'PROPOSED CONCEPT',
              image: './assets/experiences/09-hologram-rooms.jpg',
              description:
                'Volumetric light-field chambers designed for glasses-free 3D holographic storytelling, cultural exhibitions, and live virtual stages.',
            },
          ],
        },
      ],
    },
  },

  ar: {
    meta: {
      code: 'قبة عمّان // ملف مفاهيمي',
      location: 'عمّان، الأردن',
      status: 'مقترح معماري وتطويري مفاهيمي',
    },
    nav: {
      brandName: 'قبة عمّان',
      brandSub: 'مفهوم معماري وتجاري ذكي للمستقبل',
      links: [
        { id: '01', label: 'الرؤية', href: '#vision' },
        { id: '02', label: 'العمارة', href: '#top' },
        { id: '03', label: 'التجارب التفاعلية', href: '#experiences' },
        { id: '04', label: 'منظومة الأعمال', href: '#merchant-os' },
      ],
      cta: 'الملف التنفيذي',
      langToggle: 'English',
    },
    hero: {
      eyebrow: 'عمّان، الأردن • وجهة مستقبلية مقترحة',
      headlineLine1: 'مستقبل التسوق',
      headlineItalic: 'والتجارب و المغامرة',
      headlineLine2: 'في قبة عمّان.',
      description:
        'معلم معماري مقترح في عمّان يجمع بين القباب ، والترفيه التفاعلي، والتجارة الذكية.',
      primaryCta: 'استكشف التجارب',
      secondaryCta: 'رؤية المشروع',
      robotGreeting: 'أهلاً بكم في قبة عمّان',
      robotSub: 'المرافق الذكي ثلاثي الأبعاد • مرّر المؤشر للتحية',
      stakeholderLabel:
        'عرض مفاهيمي للشركاء الاستراتيجيين والمستثمرين والمستأجرين والتعاون الدبلوماسي',
    },
    editorialPrelude: {
      index: '01 // الأطروحة التنفيذية',
      tag: 'التصور المعماري الأصلي',
      headingRegular: 'جسر معماري يربط بين',
      headingItalic: 'أصالة عمّان ومستقبل التجارة الذكية.',
      body1:
        'لا يُطرح مشروع «قبة عمّان» كمركز تسوق تقليدي، بل كمنظومة معمارية وترفيهية وتقنية متكاملة. فمن خلال المزج بين التكوينات الحجرية المتقنة ، يقدم المشروع رؤية لمعلم حضري بارز في عمّان.',
      body2:
        'صُمم هذا العرض التفاعلي كملف تعريفي مفاهيمي للمستثمرين الاستراتيجيين، والعلامات التجارية الرائدة، والشركاء الهندسيين، ومبادرات التعاون التجاري والتقني الثنائي .',
      pillars: [
        {
          num: '١',
          title: 'عمارة القبتين ',
          text: 'تكوين معماري فريد يجمع بين القبة النباتية الرئيسية والنفق الزجاجي المعلق وأجنحة الكاسرات الحجرية.',
        },
        {
          num: '٢',
          title: 'تجارب ترفيهية والمغامرة للزوار',
          text: 'مفهوم مقترح يضم تجارب الواقع الافتراضي (VR)، وساحات الرياضات الإلكترونية، وسينما IMAX داخل القبة، وغرف الهولوغرام.',
        },
        {
          num: '٣',
          title: 'كفاءة تشغيلية للأعمال والمتاجر',
          text: 'حلول مقترحة للخدمات اللوجستية المشتركة وأدوات إدارة ذكية تدعم المستأجرين وتسهل عملياتهم.',
        },
      ],
    },
    experiences: {
      index: '03 // رحلة التجارب المغامرة',
      conceptBadge: 'مفاهيم ترفيهية مقترحة • عرض تعريفي غير تشغيلي',
      visualBadge: 'تصور معماري مفاهيمي',
      spatialBadge: 'معاينة المسرح الفضائي ثلاثي الأبعاد',
      headingRegular: 'ثلاثة عوالم تفاعلية يقودها',
      headingItalic: 'التصميم المعماري الفضائي.',
      subtitle:
        'تصفّح الرحلة المفاهيمية المتصلة داخل «قبة عمّان» — بدءاً من محاكيات الواقع الافتراضي الحركية وساحات الرياضات الإلكترونية وصولاً إلى العروض المغامرة تحت القبة الجيوديسية الرئيسية.',
      scrollHint: 'مرّر للانتقال بين المناطق أو اختر أي تجربة',
      locatorTitle: 'موقع المنطقة داخل القبة',
      robotGuidePrefix: 'المرافق الذكي //',
      zones: [
        {
          id: 'vr-world',
          num: '٠١',
          code: 'المنطقة 01 // عالم الواقع الافتراضي',
          navLabel: 'عالم الواقع الافتراضي',
          titleRegular: 'عالم الواقع الافتراضي:',
          titleItalic: 'محاكاة حركية كاملة.',
          robotStatus: 'معايرة الحركة والواقع الافتراضي',
          domeSector: 'الجناح الغربي والردهة المعمارية • مفهوم مقترح',
          locatorCoords: { x: 26, y: 56 },
          summary:
            'منظومة مقترحة من محاكيات الواقع الافتراضي التفاعلية التي تدمج المنصات الهيدروليكية متعددة المحاور وتيارات الهواء الموجهة والاستجابة الحسية.',
          attractions: [
            {
              code: 'VR — 01',
              title: 'سباقات سيارات الواقع الافتراضي',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/01-vr-car-racing.jpg',
              description:
                'مقصورات قيادة هيدروليكية متعددة المحاور مع عجلات قيادة ذات استجابة حسية وحلبات سباق افتراضية متزامنة.',
            },
            {
              code: 'VR — 02',
              title: 'ألعاب الواقع الافتراضي التفاعلية',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/02-vr-gaming.jpg',
              description:
                'ساحات لعب مكانية حرة الحركة مزودة بتتبع بصري دقيق ومهام جماعية تفاعلية.',
            },
            {
              code: 'VR — 03',
              title: 'الطيران الشراعي الافتراضي',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/03-vr-paragliding.jpg',
              description:
                'منظومة مظلات معلقة مع تيارات هوائية متغيرة تحاكي التحليق الحر فوق تضاريس طبيعية بانورامية.',
            },
            {
              code: 'VR — 04',
              title: 'ركوب الأمواج الافتراضي',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/04-vr-surfing.jpg',
              description:
                'منصات توازن جيروسكوبية تحاكي حركة الأمواج مع مؤثرات صوتية محيطية وتفاعل حركي مباشر.',
            },
          ],
        },
        {
          id: 'gaming-esports',
          num: '٠٢',
          code: 'المنطقة 02 // الألعاب والرياضات الإلكترونية',
          navLabel: 'الألعاب والرياضات الإلكترونية',
          titleRegular: 'الألعاب وساحة',
          titleItalic: 'الرياضات الإلكترونية.',
          robotStatus: 'وضع البطولات والبث التنافسي',
          domeSector: 'النفق الزجاجي الأسطواني المركزي • مفهوم مقترح',
          locatorCoords: { x: 52, y: 49 },
          summary:
            'مركز تنافسي مقترح يجمع بين صالة ألعاب فيديو تفاعلية حديثة ومدرج متكامل لبطولات الرياضات الإلكترونية.',
          attractions: [
            {
              code: 'GE — 01',
              title: 'صالة ألعاب الفيديو الحديثة',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/05-video-game-hall.jpg',
              description:
                'ردهة ألعاب تفاعلية من الجيل الجديد تضم كبسولات لعب فائقة السرعة ومنصات إيقاعية ومساحات اجتماعية للزوار.',
            },
            {
              code: 'GE — 02',
              title: 'ساحة المنافسات الرقمية (Esports)',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/06-esports-digital-arena.jpg',
              description:
                'مدرج تنافسي متدرج داخل القبة مزود بمقصورات زجاجية معزولة صوتياً للفرق وحلقات عرض LED علوية بزاوية 360 درجة.',
            },
          ],
        },
        {
          id: 'immersive-attractions',
          num: '٠٣',
          code: 'المنطقة 03 // التجارب المغامرة, والعروض الكبرى',
          navLabel: 'التجارب المغامرة',
          titleRegular: 'معالم القبة',
          titleItalic: 'المغامرة والسينمائية.',
          robotStatus: 'وضع العروض الهولوغرامية وسينما القبة',
          domeSector: 'القبة الزجاجية الجيوديسية الرئيسية • مفهوم مقترح',
          locatorCoords: { x: 74, y: 38 },
          summary:
            'قاعات عرض مفاهيمية كبرى تحت القبة الجيوديسية الرئيسية تمزج بين الاكتشاف العلمي التفاعلي وسينما IMAX الليزرية وغرف الهولوغرام.',
          attractions: [
            {
              code: 'IA — 01',
              title: 'غرفة العلوم المغامرة',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/07-immersive-science-room.jpg',
              description:
                'معرض علمي تفاعلي بزاوية 360 درجة للفيزياء والفضاء والبيئة يستجيب لحركة الزوار في الوقت الفعلي.',
            },
            {
              code: 'IA — 02',
              title: 'سينما IMAX داخل القبة الرئيسية',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/08-imax-dome-cinema.jpg',
              description:
                'قاعة سينما ليزرية واسعة المجال معزولة صوتياً ومصممة هندسياً لتندمج داخل هيكل القبة الجيوديسية الرئيسية.',
            },
            {
              code: 'IA — 03',
              title: 'غرف الهولوغرام',
              conceptTag: 'مفهوم مقترح',
              image: './assets/experiences/09-hologram-rooms.jpg',
              description:
                'قاعات عرض حجمية ثلاثية الأبعاد تقدم عروضاً هولوغرامية ثقافية وعلمية وترفيهية دون الحاجة لنظارات خاصة.',
            },
          ],
        },
      ],
    },
  },
};

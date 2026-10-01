/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  // --- دينية (المعصومون والعلوم) ---
  {
    id: 'prophet',
    name: 'النبي محمد (ص)',
    group: 'دينية',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-7bc2043d3cbb?q=80&w=1000&auto=format&fit=crop',
    sourceUrl: 'https://shiaonlinelibrary.com/',
    questions: [
      { id: 'pr1', text: 'ما هو اسم أم النبي محمد (ص) التي توفيت وهو في السادسة من عمره؟', answer: 'آمنة بنت وهب', points: 20, isAnswered: false },
      { id: 'pr2', text: 'بأي اسم ذُكر النبي محمد (ص) في التوراة والإنجيل؟', answer: 'أحمد', points: 40, isAnswered: false },
      { id: 'pr3', text: 'من هو الصحابي الذي أرجعه النبي (ص) ليبلغ خبر الولاية؟', answer: 'علي بن أبي طالب (ع) في غدير خم', points: 60, isAnswered: false },
      { id: 'pr4', text: 'ما هو العام الميلادي التقريبي الذي ولد فيه النبي (ص) والملقب بعام الفيل؟', answer: '570 ميلادي', points: 20, isAnswered: false },
      { id: 'pr5', text: 'ما هو اللقب الذي اشتهر به النبي (ص) في مكة لصدقه وأمانته؟', answer: 'الصادق الأمين', points: 20, isAnswered: false },
      { id: 'pr6', text: 'من هي المرضعة التي أرضعت النبي (ص) في بادية بني سعد؟', answer: 'حليمة السعدية', points: 20, isAnswered: false },
      { id: 'pr7', text: 'كم كان عمر النبي (ص) عندما نزل عليه الوحي في غار حراء؟', answer: '40 سنة', points: 40, isAnswered: false },
      { id: 'pr8', text: 'من هي أول زوجات النبي (ص) وأول من آمنت به من النساء؟', answer: 'السيدة خديجة بنت خويلد (ع)', points: 40, isAnswered: false },
      { id: 'pr9', text: 'ما هو اسم الناقة التي امتطاها النبي (ص) في رحلة الهجرة المباركة؟', answer: 'القصواء', points: 40, isAnswered: false },
      { id: 'pr10', text: 'إلى أي مدينة هاجر المسلمون في الهجرة الأولى فراراً من أذى قريش؟', answer: 'الحبشة', points: 40, isAnswered: false },
      { id: 'pr11', text: 'في أي عام هجري تم فتح مكة ودخل الناس في دين الله أفواجاً؟', answer: 'العام الثامن الهجري', points: 60, isAnswered: false },
      { id: 'pr12', text: 'ما هو اسم الغزوة التي وقعت في شهر رمضان واعتُبرت "يوم الفرقان"؟', answer: 'غزوة بدر الكبرى', points: 60, isAnswered: false },
      { id: 'pr13', text: 'ما هو اسم الصلح الذي عقده النبي (ص) مع قريش واعتبر فتحاً مبيناً؟', answer: 'صلح الحديبية', points: 60, isAnswered: false },
      { id: 'pr14', text: 'في أي شهر هجري وُلد النبي محمد (ص)؟', answer: 'في شهر ربيع الأول', points: 20, isAnswered: false },
      { id: 'pr15', text: 'من هو رفيق النبي (ص) في غار ثور أثناء رحلة الهجرة إلى المدينة؟', answer: 'أبو بكر الصديق', points: 20, isAnswered: false },
      { id: 'pr16', text: 'ما هي آخر غزوة غزاها النبي (ص) بنفسه؟', answer: 'غزوة تبوك', points: 20, isAnswered: false },
      { id: 'pr17', text: 'ما هو لقب عم النبي (ص) حمزة بن عبد المطلب الذي استُشهد في أحد؟', answer: 'سيد الشهداء', points: 40, isAnswered: false },
      { id: 'pr18', text: 'كم مرة حج النبي (ص) بعد هجرته إلى المدينة المنورة؟', answer: 'مرة واحدة (حجة الوداع)', points: 40, isAnswered: false },
      { id: 'pr19', text: 'من هو الصحابي الذي أرسله النبي (ص) ليكون أول سفير للإسلام في المدينة قبل الهجرة؟', answer: 'مصعب بن عمير', points: 40, isAnswered: false },
      { id: 'pr20', text: 'ما اسم الغزوة التي هُزم فيها المشركون بقوة الريح والرعب بعد حصار المدينة؟', answer: 'غزوة الخندق (الأحزاب)', points: 60, isAnswered: false },
      { id: 'pr21', text: 'ما اسم الفرس الذي كان للنبي (ص) وكان يسبق الخيل؟', answer: 'لزاز (أو السكب)', points: 60, isAnswered: false },
      { id: 'pr22', text: 'من هي المرأة التي تزوجها النبي (ص) وكانت ابنة ملك يهود بني النضير؟', answer: 'صفية بنت حيي بن أخطب', points: 60, isAnswered: false },
      { id: 'pr23', text: 'من هو الصحابي الذي أرجعه النبي (ص) في غدير خم ليبلغ خبر الولاية؟', answer: 'علي بن أبي طالب (ع)', points: 20, isAnswered: false },
    ]
  },
  {
    id: 'nehj',
    name: 'نهج البلاغة',
    group: 'دينية',
    imageUrl: 'https://images.unsplash.com/photo-1585036156171-383fb24b13bb?q=80&w=1000&auto=format&fit=crop',
    sourceUrl: 'https://balaghah.net/',
    questions: [
      { id: 'nj1', text: 'من هو جامع خطب ورسائل أمير المؤمنين (ع) في كتاب "نهج البلاغة"؟', answer: 'الشريف الرضي', points: 20, isAnswered: false },
      { id: 'nj2', text: 'ما هو اسم الخطبة التي يصف فيها الإمام علي (ع) المتقين؟', answer: 'خطبة همام (أو خطبة المتقين)', points: 40, isAnswered: false },
      { id: 'nj3', text: 'لمن كتب الإمام علي (ع) أطول وأشهر عهد في كتاب نهج البلاغة؟', answer: 'لمالك الأشتر (عند توجيهه لمصر)', points: 60, isAnswered: false },
    ]
  },
  {
    id: 'zahra',
    name: 'سيرة الزهراء (ع)',
    group: 'دينية',
    imageUrl: 'https://images.unsplash.com/photo-1598418049285-d67b2829288f?q=80&w=1000&auto=format&fit=crop',
    sourceUrl: 'https://al-islam.org/',
    questions: [
      { id: 'z1', text: 'ما تسمى التسبيحة التي علمها النبي (ص) لابنته فاطمة وتتكون من 100 ذكر؟', answer: 'تسبيح الزهراء (34 الله أكبر، 33 الحمد لله، 33 سبحان الله)', points: 20, isAnswered: false },
      { id: 'z2', text: 'ما اسم الأرض التي طالبت بها السيدة الزهراء (ع) كحق شرعي؟', answer: 'فدك', points: 40, isAnswered: false },
      { id: 'z3', text: 'بأي لقب لُقبت السيدة الزهراء (ع) لشدة عبادتها وضياء وجهها؟', answer: 'الزهراء', points: 60, isAnswered: false },
    ]
  },
  {
    id: 'imams_history',
    name: 'سيرة الأئمة (ع)',
    group: 'دينية',
    imageUrl: 'https://images.unsplash.com/photo-1583091917631-0985eb9319e7?q=80&w=1000&auto=format&fit=crop',
    sourceUrl: 'https://wikishia.net/',
    questions: [
      { id: 'ih1', text: 'من هو الإمام الذي استُشهد في معركة كربلاء ولقب بـ "سيد الشهداء"؟', answer: 'الإمام الحسين (ع)', points: 20, isAnswered: false },
      { id: 'ih2', text: 'ما هو لقب الإمام الثامن علي بن موسى (ع) والذي يعني "الشخص الذي رضي به الجميع"؟', answer: 'الرضا', points: 40, isAnswered: false },
      { id: 'ih3', text: 'من هم الأئمة الـ "عسكريين"؟ ولماذا لقبوا بهذا اللقب؟', answer: 'الإمام الهادي (ع) والإمام العسكري (ع)، لسكنهم في منطقة العسكر بـ سامراء', points: 60, isAnswered: false },
      { id: 'ih4', text: 'من هو الإمام الأول الذي بايعه النبي (ص) يوم الغدير؟', answer: 'الإمام علي بن أبي طالب (ع)', points: 20, isAnswered: false },
      { id: 'ih5', text: 'ما هو اسم الإمام الذي ولد في سامراء وهو الإمام الثاني عشر وغائب عن الأنظار؟', answer: 'الإمام المهدي (عج)', points: 20, isAnswered: false },
      { id: 'ih6', text: 'من هو الإمام الذي لقب بـ "باقر العلوم" لأنه بقر العلم بقراً؟', answer: 'الإمام محمد بن علي الباقر (ع)', points: 40, isAnswered: false },
      { id: 'ih7', text: 'من هو الإمام الذي استُشهد مسموماً في السجن ببغداد في عهد هارون الرشيد؟', answer: 'الإمام موسى بن جعفر الكاظم (ع)', points: 40, isAnswered: false },
      { id: 'ih8', text: 'ما هو لقب الإمام العاشر علي بن محمد (ع) الذي سكن العسكر في سامراء؟', answer: 'الهادي', points: 40, isAnswered: false },
      { id: 'ih9', text: 'ما هو اسم والدي الإمام محمد الجواد (ع)؟', answer: 'الإمام علي الرضا (ع) والسيدة خيزران', points: 60, isAnswered: false },
      { id: 'ih10', text: 'كم سنة استمرت إمامة الإمام علي بن الحسين "زين العابدين" (ع) تقريباً؟', answer: '34-35 سنة', points: 60, isAnswered: false },
      { id: 'ih11', text: 'من هو الإمام الذي لُقب بـ "الزكي" و "العسكري" وكان والداً للإمام المهدي (عج)؟', answer: 'الإمام الحسن بن علي العسكري (ع)', points: 60, isAnswered: false },
      { id: 'ih12', text: 'ما هو لقب الإمام الرابع علي بن الحسين (ع) الذي اشتهر بكثرة سجوده وبكائه؟', answer: 'السجاد', points: 20, isAnswered: false },
      { id: 'ih13', text: 'من هو الإمام الذي أُجبر على الانتقال من المدينة المنورة إلى مرو (خراسان) بطلب من المأمون؟', answer: 'الإمام علي بن موسى الرضا (ع)', points: 40, isAnswered: false },
    ]
  },
  {
    id: 'risalat_huquq',
    name: 'رسالة الحقوق',
    group: 'دينية',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
    sourceUrl: 'https://sajjadia.com/',
    questions: [
      { id: 'rh1', text: 'من هو الإمام صاحب "رسالة الحقوق" الشهيرة؟', answer: 'الإمام زين العابدين علي بن الحسين (ع)', points: 20, isAnswered: false },
      { id: 'rh2', text: 'ما هو "أكبر الحقوق" الذي ذكره الإمام في مقدمة الرسالة؟', answer: 'حق الله الأكبر (أن تعبده ولا تشرك به شيئاً)', points: 40, isAnswered: false },
      { id: 'rh3', text: 'أي حق يأتي ثانياً في الأهمية بعد حق الله في الرسالة؟', answer: 'حق النفس (أن تستعملها في طاعة الله)', points: 60, isAnswered: false },
    ]
  },
  {
    id: 'quran_complete',
    name: 'أكمل الآية',
    group: 'دينية',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629afabfeae?q=80&w=1000&auto=format&fit=crop',
    sourceUrl: 'https://tanzil.net/',
    questions: [
      { id: 'qc1', text: 'أكمل قوله تعالى: "يُوفُونَ بِالنَّذْرِ وَيَخَافُونَ يَوْمًا..."', answer: 'كَانَ شَرُّهُ مُسْتَطِيرًا * وَيُطْعِمُونَ الطَّعَامَ عَلَى حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا', points: 20, isAnswered: false },
      { id: 'qc2', text: 'أكمل قوله تعالى: "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنْكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ..."', answer: 'وَيُطَهِّرَكُمْ تَطْهِيرًا', points: 40, isAnswered: false },
      { id: 'qc3', text: 'أكمل قوله تعالى: "قُل لَّا أَسْأَلُكُمْ عَلَيْهِ أَجْرًا إِلَّا..."', answer: 'الْمَوَدَّةَ فِي الْقُرْبَى', points: 60, isAnswered: false },
    ]
  },
  // --- جغرافي وخرائط ---
  {
    id: 'maps_global',
    name: 'القوائم الأخرى',
    group: 'الخرائط',
    iconUrl: 'LayoutGrid',
    imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { id: 'mg1', text: 'ما هي عاصمة العراق والتي بناها الخليفة المنصور؟', answer: 'بغداد', points: 20, isAnswered: false },
      { id: 'mg2', text: 'في أي دولة تقع مدينة "مشهد" التي تضم مرقد الإمام الرضا (ع)؟', answer: 'إيران', points: 40, isAnswered: false },
      { id: 'mg3', text: 'ما هو اسم المسجد الذي يعتبر "قبلة المسلمين الأولى" ويقع في فلسطين؟', answer: 'المسجد الأقصى', points: 60, isAnswered: false },
    ]
  },
  {
    id: 'map_riddles',
    name: 'تحدي الخرائط',
    group: 'الخرائط',
    iconUrl: 'Navigation',
    imageMode: true,
    imageUrl: 'https://images.unsplash.com/photo-1524661135-6404803725db?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { id: 'mr1', text: 'ما هي الدولة التي لها حدود مع 14 دولة وتعتبر الأكبر في العالم مساحة؟', answer: 'روسيا', points: 20, isAnswered: false },
      { id: 'mr2', text: 'أصغر دولة في العالم من حيث المساحة والسكان وتوجد داخل مدينة روما، فما هي؟', answer: 'الفاتيكان', points: 40, isAnswered: false },
      { id: 'mr3', text: 'قارة تخلو تماماً من الصحاري، فما هي؟', answer: 'أوروبا', points: 60, isAnswered: false },
    ]
  },
  {
    id: 'guess_country_map',
    name: 'خمن الدولة (خريطة)',
    group: 'الخرائط',
    iconUrl: 'MapPin',
    imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { 
        id: 'gc1', 
        text: 'ما اسم هذه الدولة المشار إليها باللون المميز في الخريطة؟', 
        answer: 'العراق', 
        points: 20, 
        isAnswered: false,
        imageUrl: 'https://img.icons8.com/plasticine/512/iraq.png' 
      },
      { 
        id: 'gc2', 
        text: 'بناءً على موقعها الجغرافي والدول المحيطة، ما اسم هذه الدولة؟', 
        answer: 'المملكة العربية السعودية', 
        points: 40, 
        isAnswered: false, 
        imageUrl: 'https://img.icons8.com/plasticine/512/saudi-arabia.png'
      },
      { 
        id: 'gc3', 
        text: 'دولة عربية تطل على البحر الأحمر والمتوسط، ما اسمها في الخريطة؟', 
        answer: 'مصر', 
        points: 60, 
        isAnswered: false,
        imageUrl: 'https://img.icons8.com/plasticine/512/egypt.png'
      },
    ]
  },
  // --- ثقافة وعلوم ---
  {
    id: 'general_wisdom',
    name: 'أعلام ورموز',
    group: 'ثقافة',
    imageUrl: 'https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { id: 'gw1', text: 'من هو العالم الملقب بـ "أبو الكيمياء" وكان تلميذاً للإمام الصادق (ع)؟', answer: 'جابر بن حيان', points: 20, isAnswered: false },
      { id: 'gw2', text: 'من هو الفيلسوف والطبيب المسلم صاحب كتاب "القانون في الطب"؟', answer: 'ابن سينا', points: 40, isAnswered: false },
      { id: 'gw3', text: 'ما اسم الرحالة العربي الشهير الذي طاف العالم وكتب "تحفة النظار"؟', answer: 'ابن بطوطة', points: 60, isAnswered: false },
    ]
  },
  {
    id: 'modern_tech',
    name: 'تقنية وابتكار',
    group: 'تقنية',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { id: 'mt1', text: 'ما هو الاختصار لـ "الذكاء الاصطناعي" باللغة الإنجليزية؟', answer: 'AI (Artificial Intelligence)', points: 20, isAnswered: false, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/440px-ChatGPT_logo.svg.png' },
      { id: 'mt2', text: 'ما اسم تقنية الاتصال لاسلكي قصير المدى المستخدمة في "الدفع باللمس"؟', answer: 'NFC', points: 40, isAnswered: false, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/NFC_logo.svg/440px-NFC_logo.svg.png' },
      { id: 'mt3', text: 'من هو الشخص الذي يعتبر مؤسس شركة آبل (Apple) وصاحب فكرة الآيفون؟', answer: 'ستيف جوبز', points: 60, isAnswered: false, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Steve_Jobs_at_the_Apple_Council_on_Foreign_Relations_2010.jpg/440px-Steve_Jobs_at_the_Apple_Council_on_Foreign_Relations_2010.jpg' },
    ]
  },
  {
    id: 'sports',
    name: 'رياضة وشعارات',
    group: 'منوعة',
    iconUrl: 'Trophy',
    imagesEnabled: true,
    videoEnabled: true,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { id: 's1', text: 'من هو المنتخب الفائز بكأس العالم 2022؟', answer: 'الأرجنتين', points: 20, isAnswered: false, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/440px-Flag_of_Argentina.svg.png' },
      { id: 's2', text: 'لمن يعود هذا الشعار الذي يمثل أحد أشهر أندية كرة القدم في العالم؟', answer: 'ريال مدريد (Real Madrid)', points: 40, isAnswered: false, imageUrl: 'https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png' },
      { id: 's3', text: 'في أي دولة أقامة أول دورة ألعاب أولمبية حديثة عام 1896؟', answer: 'اليونان', points: 60, isAnswered: false, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Olympic_flag.svg/440px-Olympic_flag.svg.png' },
    ]
  },
  {
    id: 'logos',
    name: 'تحدي الشعارات',
    group: 'منوعة',
    iconUrl: 'Palette',
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { 
        id: 'l1', 
        text: 'لمن يعود هذا الشعار وبأي شركة يرتبط؟', 
        answer: 'نايكي (Nike)', 
        points: 20, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png' 
      },
      { 
        id: 'l2', 
        text: 'ما اسم هذه الشركة التقنية الشهيرة التي تظهر في الشعار؟', 
        answer: 'آبل (Apple)', 
        points: 20, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png' 
      },
      { 
        id: 'l3', 
        text: 'إلى أي شركة سيارات فارهة ينتمي هذا الشعار؟', 
        answer: 'مرسيدس بنز (Mercedes-Benz)', 
        points: 40, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png' 
      },
      { 
        id: 'l4', 
        text: 'ما هي هذه السلسلة الشهيرة للمطاعم السريعة التي تستخدم هذا الحرف الأصفر؟', 
        answer: 'ماكدونالدز (McDonald\'s)', 
        points: 40, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png' 
      },
      { 
        id: 'l5', 
        text: 'لمن يعود هذا الشعار الذي يمثل أكبر محرك بحث في العالم؟', 
        answer: 'جوجل (Google)', 
        points: 60, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png' 
      },
      { 
        id: 'l6', 
        text: 'ما هي هذه المؤسسة السعودية العملاقة التي تظهر في الشعار وتعتبر الأكبر عالمياً في مجالها؟', 
        answer: 'أرامكو السعودية (Saudi Aramco)', 
        points: 40, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png' 
      },
      { 
        id: 'l7', 
        text: 'إلى أي نادي رياضي سعودي ينتمي هذا الشعار الشهير؟', 
        answer: 'نادي الهلال السعودي', 
        points: 40, 
        isAnswered: false, 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/ar/thumb/0/05/Logo_al-hilal.svg/1200px-Logo_al-hilal.svg.png' 
      },
    ]
  },
  {
    id: 'saudi_history',
    name: 'تاريخ السعودية',
    group: 'تاريخ',
    iconUrl: 'History',
    imageUrl: 'https://images.unsplash.com/photo-1586724230021-4c38383a6a9d?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { 
        id: 'sh1', 
        text: 'من هو مؤسس الدولة السعودية الثالثة والملك الأول للمملكة العربية السعودية بالصيغة الحالية؟', 
        answer: 'الملك عبدالعزيز بن عبدالرحمن آل سعود', 
        points: 20, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ibn_Saud_Portrait.jpg/440px-Ibn_Saud_Portrait.jpg'
      },
      { 
        id: 'sh2', 
        text: 'ما هي المدينة التاريخية التي كانت عاصمة الدولة السعودية الأولى وتعتبر اليوم موقعاً للتراث العالمي؟', 
        answer: 'الدرعية', 
        points: 20, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/At-Turaif_District_-_Diriyah.jpg/440px-At-Turaif_District_-_Diriyah.jpg'
      },
      { 
        id: 'sh3', 
        text: 'في أي عام تم إعلان توحيد المملكة العربية السعودية تحت اسمها الحالي؟', 
        answer: '1351 هـ / 1932 م', 
        points: 20, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Flag_of_Saudi_Arabia.svg/250px-Flag_of_Saudi_Arabia.svg.png'
      },
      { 
        id: 'sh4', 
        text: 'ما اسم الحصن التاريخي الذي استعاده الملك عبدالعزيز عام 1902 ليبدأ منه رحلة توحيد المملكة؟', 
        answer: 'قصر المصمك', 
        points: 40, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Masmak_Fort_Riyadh.jpg/440px-Masmak_Fort_Riyadh.jpg'
      },
      { 
        id: 'sh5', 
        text: 'من هو الإمام الذي أسس الدولة السعودية الثانية واتخذ من الرياض عاصمة لها؟', 
        answer: 'الإمام تركي بن عبدالله بن محمد آل سعود', 
        points: 40, 
        isAnswered: false,
        imageUrl: 'https://img.icons8.com/color/512/trophy.png'
      },
      { 
        id: 'sh6', 
        text: 'ما هو الاسم القديم لمدينة الرياض قبل أن تصبح عاصمة للدولة السعودية؟', 
        answer: 'حجر اليمامة', 
        points: 40, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Riyadh_Skyline.jpg/440px-Riyadh_Skyline.jpg'
      },
      { 
        id: 'sh7', 
        text: 'ما هو اسم أول بئر نفط تم اكتشافها بكميات تجارية في المملكة العربية السعودية عام 1938م؟', 
        answer: 'بئر الدمام رقم 7 (بئر الخير)', 
        points: 60, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Dammam_7.jpg/440px-Dammam_7.jpg'
      },
      { 
        id: 'sh8', 
        text: 'ما هو العام الذي شهد توقيع "اتفاق الدرعية" التاريخي بين الإمام محمد بن سعود والشيخ محمد بن عبدالوهاب؟', 
        answer: '1157 هـ / 1744 م', 
        points: 60, 
        isAnswered: false,
        imageUrl: 'https://img.icons8.com/color/512/scroll.png'
      },
      { 
        id: 'sh9', 
        text: 'من هو الملك السعودي الذي كان أول من اتخذ لقب "خادم الحرمين الشريفين" بشكل رسمي؟', 
        answer: 'الملك فهد بن عبدالعزيز رحمه الله', 
        points: 60, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/King_Fahd_of_Saudi_Arabia.jpg/440px-King_Fahd_of_Saudi_Arabia.jpg'
      },
      { 
        id: 'sh10', 
        text: 'في عهد أي ملك سعودي وصلت أول نسخة من طائرة "بوينج" للمملكة، معلنة بداية الطيران التجاري السعودي؟', 
        answer: 'الملك عبدالعزيز (في عام 1945)', 
        points: 60, 
        isAnswered: false,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Douglas_DC-3_Saudi_Arabian_Airlines.jpg/440px-Douglas_DC-3_Saudi_Arabian_Airlines.jpg'
      }
    ]
  },
  {
    id: 'most_consumed',
    name: 'الأكثر استهلاكاً',
    group: 'ثقافة',
    iconUrl: 'TrendingUp',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop',
    questions: [
      { id: 'mc1', text: 'ما هو المنتج الغذائي الأكثر استهلاكاً في العالم من حيث الحجم الإجمالي؟', answer: 'الأرز', points: 60, isAnswered: false, source: 'الفاو (FAO)', sourceUrl: 'https://www.fao.org' },
      { id: 'mc2', text: 'أي من المشروبات التالية يعتبر الأكثر استهلاكاً في العالم بعد الماء؟', answer: 'الشاي', points: 60, isAnswered: false, source: 'منظمة الشاي الدولية', sourceUrl: 'https://www.inttea.com' },
      { id: 'mc3', text: 'ما هي الفاكهة التي تحتل المركز الأول عالمياً من حيث كمية الاستهلاك والإنتاج؟', answer: 'الموز', points: 60, isAnswered: false, source: 'بيانات زراعية عالمية', sourceUrl: 'https://www.statista.com' },
      { id: 'mc4', text: 'ما هو نوع اللحوم الأكثر استهلاكاً على مستوى العالم (إحصائياً)؟', answer: 'لحم الدواجن (الدجاج)', points: 60, isAnswered: false, source: 'OECD', sourceUrl: 'https://data.oecd.org' },
      { id: 'mc5', text: 'أي نوع من الزيوت النباتية هو الأكثر إنتاجاً واستهلاكاً في الصناعات الغذائية عالمياً؟', answer: 'زيت النخيل', points: 60, isAnswered: false, source: 'أبحاث السوق العالمي', sourceUrl: 'https://www.grandviewresearch.com' },
    ]
  }
];

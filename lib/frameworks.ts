import { FrameworkSection, ScriptFramework } from './types';

export interface FrameworkBlueprint {
  id: ScriptFramework;
  name: string;
  tagline: string;
  recommendedFor: string;
  sections: Omit<FrameworkSection, 'id' | 'content'>[];
}

export const FRAMEWORKS: Record<ScriptFramework, FrameworkBlueprint> = {
  AIDA: {
    id: 'AIDA',
    name: 'طريقة الانتباه والرغبة (AIDA)',
    tagline: 'الأسرع والأقوى لفيديوهات الريلز والبيع المباشر',
    recommendedFor: 'فيديوهات المنتجات، العروض الخاصة، والجرابات ذات المظهر الجذاب',
    sections: [
      {
        key: 'attention',
        label: 'الانتباه (الهوك - Hook)',
        prompt: 'إيه أول 3 ثواني اللي هيخلوا العميل يوقف سكرول فوراً؟ (صوت خبطة، سؤال صادم، مقارنة بصرية)',
      },
      {
        key: 'interest',
        label: 'الاهتمام (Interest)',
        prompt: 'إيه المشكلة الشائعة أو الميزة المثيرة؟ (مثال: ليه الجرابات الشفافة بتصفر بسرعة؟)',
      },
      {
        key: 'desire',
        label: 'الرغبة (Desire)',
        prompt: 'ورّيه جراب فالكون وحسسه بالفرق! (مقاومة الصدمات، الملمس، الليزر، الشكل الفخم)',
      },
      {
        key: 'action',
        label: 'الإجراء (Call to Action)',
        prompt: 'اطلب منه خطوة واحدة محددة بدون تردد (مثال: اطلب تصميمك بخصم 15% من لينك البايو)',
      },
    ],
  },
  PASTOR: {
    id: 'PASTOR',
    name: 'طريقة حل المشكلة والتحول (PASTOR)',
    tagline: 'الأفضل للفيديوهات التي تعالج مشكلة مزعجة لدى العميل',
    recommendedFor: 'حماية الموبايل من الكسر، اصفرار الجرابات، سوء جودة الطباعة',
    sections: [
      {
        key: 'problem',
        label: 'المشكلة (Problem)',
        prompt: 'حدد المشكلة اللي بتوجع العميل بالظبط (الموبايل وقع والشاشة اتكسرت؟)',
      },
      {
        key: 'amplify',
        label: 'التضخيم (Amplify)',
        prompt: 'تكلفة تصليح الشاشة 6000 جنيه علشان جراب رخيص بـ 50 جنيه!',
      },
      {
        key: 'story',
        label: 'القصة والحل (Story & Transformation)',
        prompt: 'إزاي فالكون صممت كفر بطبقات ممتصة للصدمات لحماية حقيقية',
      },
      {
        key: 'offer',
        label: 'العرض (Offer)',
        prompt: 'كفر فالكون المخصص + سكرين بروتكتور هدية وضمان ضد الصدمات',
      },
      {
        key: 'response',
        label: 'الاستجابة (Response)',
        prompt: 'ابعتلنا موديل موبايلك في رسايل الصفحة وهنبعتلك الديزاين خلال 5 دقايق',
      },
    ],
  },
  StoryArc: {
    id: 'StoryArc',
    name: 'قوس القصة والتجربة (Story Arc)',
    tagline: 'الأفضل لربط العميل عاطفياً ببراند فالكون وكواليس التصنيع',
    recommendedFor: 'كواليس الطباعة، قصة عميل طلب تصميم خاص، تطور البراند',
    sections: [
      {
        key: 'character',
        label: 'البطل / البداية (Character & Setting)',
        prompt: 'عميل دخل قالنا: "معايا صورة لذكرى مهمة ونفسي تفضل معايا في كل حتة"',
      },
      {
        key: 'obstacle',
        label: 'العقبة والتحدي (Obstacle)',
        prompt: 'الصورة كانت جودتها ضعيفة جداً ومفيش مطبعة عرفت تطلعها مظبوطة',
      },
      {
        key: 'struggle',
        label: 'المحاولة والحل (Struggle)',
        prompt: 'فريق تصميم فالكون عاد رسم التفاصيل بالذكاء الاصطناعي وجهز طباعة UV بارزة',
      },
      {
        key: 'resolution',
        label: 'النتيجة والنهاية (Resolution & CTA)',
        prompt: 'رياكشن العميل لما استلم الجراب.. ابعتلنا صورتك واعمل جرابك الخاص دلوقتي',
      },
    ],
  },
  THEDOC: {
    id: 'THEDOC',
    name: 'طريقة الإقناع الشامل (THEDOC Framework)',
    tagline: 'الأشمل لتفكيك كل الاعتراضات وتأكيد الثقة',
    recommendedFor: 'الفيديوهات الطويلة نسبياً (60-90 ثانية) وحملات إطلاق المنتجات الجديدة',
    sections: [
      {
        key: 'hook',
        label: 'الهوك (Target Hook)',
        prompt: 'الجملة الافتتاحية اللي بتنادي على العميل المستهدف مباشرة',
      },
      {
        key: 'why',
        label: 'ليه تسمعني؟ (The Why)',
        prompt: 'ليه فالكون مختلفة عن أي صفحة جرابات تانية على السوشيال ميديا؟',
      },
      {
        key: 'objections',
        label: 'تفكيك الاعتراضات (Objections)',
        prompt: '"طب لو الطباعة قشرت؟ طب لو المقاس مجاش مظبوط؟" الإجابة بالضمان الحقيقي!',
      },
      {
        key: 'benefits',
        label: 'الفوائد الملموسة (Benefits)',
        prompt: 'كفر أنيق، خفيف، بيحمي الكاميرا، وبيعبر عن شخصيتك',
      },
      {
        key: 'cta',
        label: 'الإجراء الأخير (Call to Action)',
        prompt: 'عرض خاص لأول 50 طلب هذا الأسبوع فقط',
      },
    ],
  },
  Freeform: {
    id: 'Freeform',
    name: 'كتابة حرة سريعة (Freeform)',
    tagline: 'بدون قيود لأفكار الاسكتشات والتريندات السريعة',
    recommendedFor: 'تريندات الصوت، الميمز، الفيديوهات العفوية السريعة',
    sections: [
      {
        key: 'hook',
        label: 'بداية الفيديو',
        prompt: 'فكرة المشهد الأول وصوت التريند',
      },
      {
        key: 'body',
        label: 'أحداث الفيديو',
        prompt: 'ما يحدث في الفيديو والحوار',
      },
      {
        key: 'cta',
        label: 'النهاية والتعليق',
        prompt: 'سؤال التعليقات أو العرض',
      },
    ],
  },
};

export function getInitialSectionsForFramework(framework: ScriptFramework): FrameworkSection[] {
  const blueprint = FRAMEWORKS[framework] || FRAMEWORKS.AIDA;
  return blueprint.sections.map((s, index) => ({
    id: `sec_${Date.now()}_${index}`,
    key: s.key,
    label: s.label,
    prompt: s.prompt,
    content: '',
  }));
}

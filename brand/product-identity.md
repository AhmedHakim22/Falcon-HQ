# Stage 5: Product Visual Identity & Design Tokens

**Document Path:** `brand/product-identity.md`  
**Date:** 2026-10-21  
**Aesthetic Foundation:** Falcon Warm Bento Architecture (استناداً إلى الديزاين المعتمد وهوية Falcon)  

---

## 1. فلسفة الهوية البصرية (Visual Philosophy)

الهوية البصرية لـ **FALCON HQ** مستوحاة مباشرة من نموذج الـ **Bento Grid** العصري المعتمد من قبل المؤسس، ومطوّعة بالكامل لتلائم طبيعة علامة **Falcon** (منتجات الجرابات والإكسسوارات الفاخرة):

- **الخلفية الأساسية:** بيج دافئ كريمي راقٍ (Warm Sand / Light Cream) يمنح إحساساً بالراحة والفخامة والملمس الطبيعي للجلود والتغليف الفاخر.
- **اللون المميز (Accent Color):** أحمر فالكون القوي (Falcon Crimson Red) كلون رئيسي للأزرار الحيوية، وشارات الإنجاز، ونقاط التفاعل.
- **البنية الهندسية (Bento Grid):** كروت بيضاء عاجية ذات حواف ناعمة جداً (`rounded-3xl` / 24px) تطفو فوق الخلفية البيج بظلال بالغة الرقة (`shadow-sm`).
- **المؤشرات الحيوية (Micro-visuals):** رسومات بيانية متوهجة وخطوط نبضية (Micro Sparklines) تعرض تطور النقاط والأفكار بدون تعقيد.

---

## 2. لوحة الألوان المعتمدة (Falcon Color Palette)

```
[Primary Canvas Background]  #F8F5F0 (Warm Sand / Beige)
[Card Background - Surface]  #FFFFFF (Pure White) & #FAF7F2 (Ivory Tint)
[Falcon Primary Brand Red]   #D32F2F (Falcon Crimson)
[Falcon Hover Red / Glow]    #B71C1C (Deep Crimson) & #EF4444 (Vibrant Red)
[Secondary Accent - Amber]   #D97706 (Warm Gold / XP Points)
[Success Indicator]          #059669 (Emerald Green - Published / Profits)
[Text - High Contrast]       #18181B (Charcoal / Dark Slate - WCAG AAA)
[Text - Muted / Subtitle]    #71717A (Warm Zinc / Subtext)
[Borders & Dividers]         #E4E0D7 (Soft Sand Border)
```

### رموز الألوان البرمجية في Tailwind CSS:
```css
:root {
  --background: #F8F5F0;       /* بيج دافئ مريح للعين */
  --card: #FFFFFF;             /* كروت بيضاء ناصعة عائمة */
  --card-elevated: #FAF8F5;    /* تدرج الكروت الداخلية */
  --border: #E8E3DA;           /* حدود ناعمة بلون الرمل */
  --primary: #D32F2F;          /* أحمر فالكون الأساسي للأزرار */
  --primary-foreground: #FFFFFF;
  --accent-gold: #F59E0B;      /* ذهبي نقاط الخبرة والتميز */
  --text-main: #1C1917;        /* أسود كربوني عالي التباين */
  --text-muted: #78716C;       /* رمادي دافئ للعناوين الفرعية */
  --radius: 1.5rem;            /* 24px حواف ناعمة بأسلوب بينتو */
}
```

---

## 3. هندسة الخطوط والطباعة (Typography)
- **الخط العربي الأساسي:** **Readex Pro** أو **Cairo** (أوزان: 400 Regular, 600 SemiBold, 700 Bold, 800 ExtraBold). خط عربي حديث جداً، يتميز بالقراءة الفائقة على شاشات الموبايل حتى بالأحجام الصغيرة.
- **الأرقام والمؤشرات الإنجليزية:** **Plus Jakarta Sans** أو **Inter** لعرض أرقام المشاهدات، والطلبات، ودرجات التقييم بدقة ووضوح عالمي.

---

## 4. مكونات شبكة الـ Bento المعتمدة في الشاشة الرئيسية (Home Bento Layout)

1. **كارت الترحيب والإلهام (Hero Bento Card):**
   - عنوان كبير ملهم بخط عريض: *"أفكارك هي اللي بتبيع."*
   - زر أحمر عريض جذاب: `+ فكرة سريعة في ثواني`.
2. **كارت مقياس السرعة والتتابع (Streak & Momentum Pill):**
   - شارة عائمة بشعلة حمراء ناعمة: `3 أيام متتالية إنجاز 🔥` مع إمكانية التجميد في العطلات.
3. **كارت رادار الأفكار (Priority Quadrant Bento):**
   - كارت بيج عاجي يعرض الأفكار الذهبية المكتملة الجاهزة للتحويل فوراً إلى سكريبت.
4. **كارت نبض النتائج (Results & Revenue Sparkline):**
   - خط نبض متوهج باللون الأحمر والزمردي يعرض إجمالي المبيعات المنسوبة لسكريبتات فالكون هذا الشهر.

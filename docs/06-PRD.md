# Stage 6: Product Requirements Document (PRD) — FALCON HQ

**Document Path:** `docs/06-PRD.md`  
**Version:** 1.0.0-MVP  
**Date:** 2026-10-21  
**Status:** **AWAITING USER HARD GATE APPROVAL**  
**Core Law:** `Research → Challenge → Design → Approve → Build → Verify`  

---

## 1. Problem Statement
علامة Falcon للمنتجات والجرابات المخصصة تعتمد اعتماداً كلياً على المحتوى الرقمي القصير (Reels / TikTok) لتوليد الطلبات والأرباح. حالياً، يعاني فريق العمل (المؤسس والشريك الكاتب) من:
1. **تشتت الأفكار:** ضياع أفكار المحتوى في شاتات الواتساب والملاحظات المتفرقة.
2. **صعوبة استخدام Notion على الموبايل:** بطء التحميل وكثرة الحقول الإجبارية التي تعطل التقاط الإلهام أثناء الحركة.
3. **شلل الصفحة البيضاء (Writer's Block):** صعوبة تحويل الفكرة إلى سكريبت فيديو محكم يعتمد على أسس الإقناع التسويقي.
4. **انعدام حلقة التغذية الراجعة (Attribution Gap):** عدم وجود ربط بين الفكرة المصورة وبين الطلبات والمبيعات الفعلية التي حققتها.
5. **تراجع الاستمرارية:** غياب نظام تحفيز خفيف يحافظ على إنتاجية الفريق الأسبوعية بدون ضغط نفسي.

---

## 2. Product Goals & Non-Goals

### الأهداف الأساسية (Product Goals):
- **سرعة التقاط فائقة:** تسجيل أي فكرة برابط أو نص من شاشة الموبايل في أقل من **15 ثانية**.
- **صياغة سكريبت احترافي في 10 دقائق:** توجيه الكاتب عبر 4 مدارس تسويقية وقوالب Open Loops بدون صفحة بيضاء.
- **إدارة سلسة للتناوب بين الشريكين:** وضوح تام لمن عليه الدور في المراجعة بدون مكالمات جانبية.
- **ربط المحتوى بالأرباح:** تسجيل مبيعات الجرابات الناتجة عن كل فيديو لمعرفة الزوايا الرابحة وتكرارها.
- **تحفيز نفسي متزن:** نظام XP ومستويات وتحديات أسبوعية غير مرهقة تحافظ على شعلة الإنتاجية.

### ما لا يدخل في النطاق صراحة (Non-Goals):
- ليس متجراً إلكترونياً للجمهور، وليس نظام إدارة مخزون ERP.
- لا يشمل روبوتات نشر تلقائي على حسابات التواصل الاجتماعي.
- لا يشمل محرر نصوص فوري متعدد المؤشرات في نفس الثانية (Multiplayer Realtime Cursors).
- لا يشمل مزامنة حية ثنائية الاتجاه مع قواعد بيانات نوشن القديمة.

---

## 3. Personas & Core Workspaces
1. **عمر (Founder & Growth Strategist - Owner/Admin):**
   - يلتقط أفكار الجرابات الرائجة أثناء تصفح تيك توك من الموبايل.
   - يقيّم الأولوية ويراجع السكريبتات الجاهزة للتصوير.
   - يدخل بيانات المبيعات والأرباح بعد نشر الفيديو.
2. **سلمى (Creative Content Partner - Editor/Collaborator):**
   - تستلم الأفكار ذات الأولوية وتبدأ السكريبت.
   - تختار المدرسة المناسبة وتكتب الهوك والـ Open Loops.
   - ترسل السكريبت للمراجعة بضغطة زر.

---

## 4. Functional Specifications by Module

### Module 1: بنك الأفكار والالتقاط السريع (Idea Bank & Quick Capture)
- **الحقول الأساسية:** العنوان (`title`), النوع (`category`: Content, Marketing, Product, Sales, BizDev), رابط الإلهام (`source_url`), ملحوظة سريعة (`notes`), المسؤول (`assignee_id`), الحالة (`status`: Inbox, Evaluating, Scripting, Action_Plan, Ready_To_Film, Published, Archived).
- **الالتقاط السريع (Quick Capture FAB):** نموذج منبثق فوري يطلب حقلين فقط: (العنوان + الرابط/الملاحظة)، ويحفظ الفكرة محلياً وفورياً مع منح `+5 XP`.
- **المسارات المتعددة (Multi-Track Routing):** بعد الحفظ، يختار المستخدم:
  1. *ابدأ سكريبت (Start Script)* $\rightarrow$ يفتح استوديو السكريبتات فوراً.
  2. *خطة عمل (Action Plan)* $\rightarrow$ ينشئ مهام وقائمة فحص بدون سكريبت.
  3. *راجع أولاً (Review First)* $\rightarrow$ يرسل إشعار للشريك.
  4. *حفظ لوقت لاحق (Save for Later)* $\rightarrow$ أرشفة في الصندوق.

### Module 2: محرك تقييم الأولوية (Priority Engine)
- **المعادلة الموزونة المعتمدة:**
  $$\text{Score} = 20 \times (0.40 \times \text{GoalFit} + 0.25 \times \text{CustomerValue} + 0.20 \times \text{Reach} + 0.15 \times \text{Ease})$$
- كل عامل يُقيّم من 1 إلى 5 عبر شرائح لمسية سريعة.
- **قاعدة الأمان الصارمة:** إذا غاب أي عامل من الـ 4، لا يتم حساب أي نسبة مئوية وهمية، وتظهر الحالة صراحة: **"لسة ماتقيمتش (Not Rated)"** بشارة رمادية لحماية دقة القرار.

### Module 3: استوديو السكريبتات (Script Studio)
- **المدارس المدمجة:**
  1. **AIDA:** حقول منفصلة لـ (الانتباه Attention، الاهتمام Interest، الرغبة Desire، الإجراء Action).
  2. **PASTOR:** حقول لـ (المشكلة Problem، التضخيم Amplify، القصة Story، التحول Transformation، العرض Offer، الاستجابة Response).
  3. **Story Arc:** حقول لـ (الشخصية Character، الرغبة Desire، العقبة Obstacle، الصراع Struggle، التحول Transformation، الحل Resolution).
  4. **THEDOC:** حقول لـ (الهوك Hook، لماذا Why، الاعتراضات Objections، الفوائد Benefits، القصة Story، الإطار Framework، الـ CTA).
- **محرك الـ Open Loops:**
  - زر ثلاثي: `مغلق (Off)`, `خفيف (Light - حلقة واحدة)`, `كامل (Full - 3 حلقات)`.
  - يولد تلقائياً كروت هوك وأسئلة غامضة في بداية السكريبت مع كروت إغلاق موازية (Payoffs) قبل الـ CTA مباشرة.
- **مؤشر زمن الإلقاء الصوتي (Speaking Time Calculator):**
  - حساب فوري لعدد الكلمات مقسوماً على 130 كلمة/دقيقة مع شريط لون ذكي (أخضر بين 30-50 ثانية، أصفر فوق 60 ثانية).

### Module 4: التعاون والمراجعة غير المتزامنة (Async Collaboration)
- **حالات السكريبت:** مسودة `Draft` $\rightarrow$ قيد الكتابة `Writing` $\rightarrow$ للمراجعة `Review Ready` $\rightarrow$ جاهز للتصوير `Ready to Film` $\rightarrow$ تم النشر `Published`.
- **منع التعارض (Section Locking):** عند فتح سكريبت من طرف عمر، يظهر لسلمى بانر هادئ: *"عمر بيراجع السكريبت ده دلوقتي"* لمنع استبدال النصوص المزدوج.
- **التعليقات الموضعية (Sticky Comments):** إمكانية تحديد أي جملة وإضافة تعليق سريع عليها.

### Module 5: نتائج البزنس والتعلم (Business Results & Learning)
- ربط السكريبت المنشور بـ:
  - رابط الفيديو المنشور على إنستغرام أو تيك توك.
  - عدد الطلبات المحققة (Orders Count).
  - الإيراد المالي الإجمالي بالجنيه المصري (Revenue in EGP).
  - عدد رسائل الاستفسار في الـ DMs.
  - نسبة الثقة في الإسناد (High / Medium / Low).
  - الدرس المستفاد الرئيسي (Core Takeaway).
- **قوالب النجاح (Winning Patterns):** تمييز السكريبتات عالية المبيعات بنجمة لتمكين الكاتب من استخدام نفس الهيكل بضغطة زر واحدة.

### Module 6: نظام التحفيز المتزن (Balanced Gamification)
- **جدول نقاط الخبرة (XP Ledger):**
  - تسجيل فكرة مكتملة العناصر: `+5 XP`
  - تقييم أولوية الفكرة بالكامل: `+5 XP`
  - إكمال مسودة سكريبت: `+15 XP`
  - اعتماد السكريبت وتجهيزه للتصوير: `+25 XP`
  - تسجيل فيديو مصور ومنشور: `+20 XP`
  - تسجيل نتائج ومبيعات فعلية: `+15 XP`
- **حماية النزاهة ومنع التلاعب (Anti-Abuse):**
  - منع احتساب الـ XP لنفس الحدث أكثر من مرة.
  - عدم احتساب النقاط للأفكار الفارغة (أقل من 15 حرفاً).
  - حذف الفكرة يخصم نقاطها من السجل للحفاظ على عدالة النظام.
- **التتابع غير الضاغط (Grace-Period Streaks):**
  - احتساب أيام الإنجاز مع منح "يوم عطلة تلقائي" أسبوعياً دون كسر العداد.

---

## 5. Non-Functional Requirements & Security

| المعيار | الهدف المحدد | طريقة التحقق |
|---|---|---|
| **السرعة وزمن الاستجابة** | LCP < 1.2s على شبكات الموبايل 4G في مصر | Lighthouse Audit & Edge Bundling |
| **التوافق اللغوي (RTL)** | توافق تام 100% مع الاتجاه العربي وتنسيق الأرقام | Tailwind RTL logical properties |
| **العمل دون اتصال (Offline)** | حفظ الأفكار والسكريبتات محلياً في IndexedDB عند انقطاع الشبكة | Service Worker + Local Hydration |
| **أمان البيانات والخصوصية** | تفعيل Row Level Security (RLS) بنسبة 100% على كافة الجداول | automated RLS test suite |
| **تكلفة الاستضافة** | 0 دولار شهرياً في مرحلة الـ MVP | Vercel Edge + Supabase Managed Free Tier |

---

## 6. Data Model Baseline (PostgreSQL Schema)

```sql
-- Core Workspaces & Users
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'collaborator')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Ideas Table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('content', 'marketing', 'product', 'sales', 'bizdev')),
  status TEXT DEFAULT 'inbox' CHECK (status IN ('inbox', 'evaluating', 'scripting', 'action_plan', 'ready_to_film', 'published', 'archived')),
  source_url TEXT,
  notes TEXT,
  creator_id UUID REFERENCES auth.users(id),
  assignee_id UUID REFERENCES auth.users(id),
  -- Priority Ratings (1 to 5)
  goal_fit_score INT CHECK (goal_fit_score BETWEEN 1 AND 5),
  customer_value_score INT CHECK (customer_value_score BETWEEN 1 AND 5),
  reach_score INT CHECK (reach_score BETWEEN 1 AND 5),
  ease_score INT CHECK (ease_score BETWEEN 1 AND 5),
  total_priority_score NUMERIC(5,2), -- Calculated automatically or NULL if unrated
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scripts Table
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  framework TEXT CHECK (framework IN ('AIDA', 'PASTOR', 'StoryArc', 'THEDOC', 'Freeform')),
  open_loops_level TEXT DEFAULT 'off' CHECK (open_loops_level IN ('off', 'light', 'full')),
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- Structured framework sections
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'writing', 'review_ready', 'ready_to_film', 'published')),
  author_id UUID REFERENCES auth.users(id),
  reviewer_id UUID REFERENCES auth.users(id),
  estimated_duration_seconds INT DEFAULT 0,
  word_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Business Results Table
CREATE TABLE business_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  published_url TEXT,
  orders_attributed INT DEFAULT 0,
  revenue_attributed NUMERIC(10,2) DEFAULT 0.00,
  inquiries_count INT DEFAULT 0,
  confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
  key_learning TEXT,
  would_repeat BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gamification & XP Ledger
CREATE TABLE xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  xp_amount INT NOT NULL,
  reference_id UUID, -- points to idea_id, script_id, or outcome_id
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. سلوك النظام في الحالات الحدية (Edge Cases Matrix)

| الحالة | السلوك المعتمد في التصميم البرمجي |
|---|---|
| **انقطاع الإنترنت المفاجئ (Offline)** | يحفظ المحرر كل تغيير في المتصفح محلياً فوراً، وتتحول شارة الحفظ إلى لون كهرماني: `محفوظ محلياً (غير متصل)`. فور عودة الشبكة، تُرفع التعديلات للسحابة تلقائياً. |
| **تعديل الطرفين لنفس السكريبت في وقت متزامن** | تفعيل ميزة قفل المسودة الهادئ (Soft Lock) مع تنبيه بصري؛ إذا حدث تعارض، يتم الاحتفاظ بالنسختين في سجل التعديلات دون مسح أي جملة. |
| **حذف فكرة أو سكريبت بالخطأ** | الحذف دائماً Soft Delete؛ يوضع العنصر في سلة المحذوفات لمدة 30 يوماً مع إمكانية استرجاعه بضغطة زر واحدة. |
| **نقص أحد عوامل تقييم الفكرة** | تظهر النتيجة كـ `Not Rated` ولا يتم حساب أي رقم مئوي مشوه. |
| **إدخال بيانات غير صالحة أو روابط مكسورة** | فحص الروابط تلقائياً والتعامل مع الروابط كأشرطة نصية قابلة للفتح دون تعليق واجهة التطبيق. |

---

## 8. معايير القبول النهائية للـ MVP (Acceptance Criteria)
1. **اختبار سرعة الإدخال:** إضافة فكرة جديدة برابط وتصنيف تكتمل في أقل من 15 ثانية على متصفح الموبايل.
2. **اختبار سلامة التقييم:** إدخال 3 أبعاد وترك الرابع فارغاً يظهر فوراً شارة `Not Rated` بدون مجموع وهمي.
3. **اختبار استوديو السكريبتات:** تغيير المدرسة من AIDA إلى PASTOR ينقل النصوص المشتركة بذكاء دون مسح كلام الكاتب.
4. **اختبار نقاط التحفيز:** اعتماد السكريبت يمنح الكاتب 25 XP في السجل فوراً ولا تتكرر النقاط عند تحديث الصفحة (Refresh).
5. **اختبار الأمان RLS:** أي استعلام مباشر عبر الـ API بدون تسجيل الدخول يُرفض تلقائياً بكود `401 / 403 Forbidden`.

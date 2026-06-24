# Chat App Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 게시판 기반 소셜 채팅 앱 Phase 1 — 게시글 작성 → 쪽지(90p) → 실시간 채팅, 코인 충전까지 작동하는 앱을 App Store + Google Play에 제출한다.

**Architecture:** Expo Router 기반 파일 라우팅, Supabase로 DB/Auth/Realtime/Storage 통합, 포인트 차감은 PostgreSQL 함수로 원자적 처리(레이스 컨디션 방지), RevenueCat으로 iOS/Android IAP 통합.

**Tech Stack:** Expo SDK 52, expo-router, Supabase JS v2, Zustand, react-native-purchases (RevenueCat), expo-image-picker, expo-notifications, TypeScript

---

## 파일 구조

```
my-chat-app/
├── app/
│   ├── _layout.tsx                  # Root layout — auth gate
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── phone.tsx                # 휴대폰 번호 입력
│   │   ├── verify.tsx               # OTP 인증
│   │   └── setup.tsx                # 프로필 설정 (닉네임/성별/생년월일)
│   └── (tabs)/
│       ├── _layout.tsx              # 바텀 탭
│       ├── board/
│       │   └── index.tsx            # 게시판 피드
│       ├── chats/
│       │   ├── index.tsx            # 채팅함
│       │   └── [id].tsx             # 채팅 스레드
│       ├── notifications/
│       │   └── index.tsx            # 알림
│       └── profile/
│           └── index.tsx            # 마이페이지
├── components/
│   ├── board/
│   │   ├── PostCard.tsx
│   │   ├── FilterChips.tsx
│   │   └── CreatePostModal.tsx
│   ├── chat/
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── PokeModal.tsx
│   └── ui/
│       ├── PointsBadge.tsx
│       └── Avatar.tsx
├── lib/
│   ├── supabase.ts                  # Supabase 클라이언트
│   ├── points.ts                    # 포인트 로직
│   ├── posts.ts                     # 게시글 CRUD
│   ├── conversations.ts             # 쪽지/채팅 로직
│   └── storage.ts                   # 이미지 업로드
├── stores/
│   ├── authStore.ts
│   └── pointsStore.ts
├── types/
│   └── index.ts
├── constants/
│   └── index.ts
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql
│       ├── 002_rls.sql
│       └── 003_functions.sql
├── __tests__/
│   ├── points.test.ts
│   └── conversations.test.ts
├── app.json
└── eas.json
```

---

## Task 1: Expo 프로젝트 초기화

**Files:**
- Create: `my-chat-app/` (프로젝트 루트)
- Create: `package.json`, `app.json`, `tsconfig.json`

- [ ] **Step 1: 프로젝트 생성**

```bash
npx create-expo-app my-chat-app --template tabs
cd my-chat-app
```

- [ ] **Step 2: 핵심 의존성 설치**

```bash
npx expo install @supabase/supabase-js react-native-url-polyfill \
  @react-native-async-storage/async-storage expo-secure-store \
  zustand expo-image-picker expo-notifications \
  react-native-purchases react-native-purchases-ui
```

- [ ] **Step 3: app.json 업데이트**

```json
{
  "expo": {
    "name": "내 앱 이름",
    "slug": "my-chat-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "mychatapp",
    "ios": {
      "bundleIdentifier": "com.yourname.mychatapp",
      "supportsTablet": false
    },
    "android": {
      "package": "com.yourname.mychatapp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

- [ ] **Step 4: 불필요한 보일러플레이트 삭제**

```bash
rm -rf app/\(tabs\)/explore.tsx app/+not-found.tsx
```

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "chore: init expo project"
```

---

## Task 2: TypeScript 타입 + 상수 정의

**Files:**
- Create: `types/index.ts`
- Create: `constants/index.ts`

- [ ] **Step 1: 타입 작성**

```typescript
// types/index.ts
export type Gender = 'M' | 'F'
export type PostCategory = '일상' | '고민' | '만남'
export type ConversationStatus = 'pending' | 'active'
export type PointTransactionType = 'daily_grant' | 'purchase' | 'send_message' | 'refund'

export interface User {
  id: string
  nickname: string
  gender: Gender
  birth_date: string        // 'YYYY-MM-DD'
  phone: string
  profile_photos: string[]
  points_balance: number
  last_active_at: string | null
  is_adult_verified: boolean
  region: string | null
  last_daily_grant_at: string | null
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  images: string[]
  category: PostCategory
  location_region: string | null
  created_at: string
  author?: Pick<User, 'nickname' | 'gender' | 'birth_date' | 'profile_photos'>
}

export interface Conversation {
  id: string
  sender_id: string
  receiver_id: string
  post_id: string
  status: ConversationStatus
  created_at: string
  other_user?: Pick<User, 'nickname' | 'gender' | 'birth_date' | 'profile_photos'>
  last_message?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

export interface PointTransaction {
  id: string
  user_id: string
  amount: number
  type: PointTransactionType
  reference_id: string | null
  created_at: string
}

export type FilterType = 'all' | 'nearby' | 'recent'
```

- [ ] **Step 2: 상수 작성**

```typescript
// constants/index.ts
export const POKE_COST = 90
export const DAILY_GRANT = 100
export const POINT_PACKAGES = [
  { id: 'points_1000', points: 1000, bonus: 0, priceKRW: 1000 },
  { id: 'points_5500', points: 5500, bonus: 500, priceKRW: 5000 },
  { id: 'points_12000', points: 12000, bonus: 2000, priceKRW: 10000 },
] as const
```

- [ ] **Step 3: 커밋**

```bash
git add types/ constants/ && git commit -m "feat: add types and constants"
```

---

## Task 3: Supabase 스키마 마이그레이션

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Supabase 프로젝트 생성**

supabase.com → New Project → 이름/비밀번호 설정 → 프로젝트 URL + anon key 복사

- [ ] **Step 2: 스키마 SQL 작성**

```sql
-- supabase/migrations/001_schema.sql

CREATE TABLE public.users (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname            text NOT NULL UNIQUE,
  gender              text NOT NULL CHECK (gender IN ('M', 'F')),
  birth_date          date NOT NULL,
  phone               text NOT NULL UNIQUE,
  profile_photos      text[] DEFAULT '{}',
  points_balance      integer NOT NULL DEFAULT 0,
  last_active_at      timestamptz,
  is_adult_verified   boolean NOT NULL DEFAULT false,
  region              text,
  last_daily_grant_at date,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content          text NOT NULL,
  images           text[] DEFAULT '{}',
  category         text NOT NULL CHECK (category IN ('일상', '고민', '만남')),
  location_region  text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.conversations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id      uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sender_id, post_id)  -- 같은 글에 중복 쪽지 방지
);

CREATE TABLE public.messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content          text NOT NULL,
  read_at          timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.point_transactions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount        integer NOT NULL,
  type          text NOT NULL CHECK (type IN ('daily_grant','purchase','send_message','refund')),
  reference_id  uuid,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason      text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blocks (
  blocker_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- 인덱스
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_region ON public.posts(location_region);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_conversations_sender ON public.conversations(sender_id);
CREATE INDEX idx_conversations_receiver ON public.conversations(receiver_id);
CREATE INDEX idx_users_last_active ON public.users(last_active_at DESC);
```

- [ ] **Step 3: Supabase SQL Editor에서 실행**

supabase.com → 프로젝트 → SQL Editor → 위 SQL 붙여넣기 → Run

- [ ] **Step 4: Storage 버킷 생성**

SQL Editor에서:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
```

- [ ] **Step 5: 커밋**

```bash
git add supabase/ && git commit -m "feat: add database schema"
```

---

## Task 4: RLS 정책

**Files:**
- Create: `supabase/migrations/002_rls.sql`

- [ ] **Step 1: RLS SQL 작성 후 실행**

```sql
-- supabase/migrations/002_rls.sql

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- users: 모든 인증 유저가 읽기, 본인만 수정
CREATE POLICY "users_read" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- posts: 모든 인증 유저가 읽기, 본인만 작성/수정/삭제
CREATE POLICY "posts_read" ON public.posts FOR SELECT TO authenticated
  USING (
    user_id NOT IN (
      SELECT blocked_id FROM public.blocks WHERE blocker_id = auth.uid()
    )
  );
CREATE POLICY "posts_insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- conversations: 당사자만 접근
CREATE POLICY "conversations_access" ON public.conversations FOR ALL TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- messages: 해당 conversation 당사자만 접근
CREATE POLICY "messages_access" ON public.messages FOR ALL TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
    )
  );

-- point_transactions: 본인 것만
CREATE POLICY "points_own" ON public.point_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- reports: 본인이 신고한 것만 삽입/조회
CREATE POLICY "reports_insert" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- blocks: 본인이 차단한 것만
CREATE POLICY "blocks_own" ON public.blocks FOR ALL TO authenticated
  USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

-- Storage: 인증 유저 업로드 가능, 공개 읽기
CREATE POLICY "images_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');
CREATE POLICY "images_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'images');
CREATE POLICY "images_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'images' AND (storage.foldername(name))[1] = auth.uid()::text);
```

- [ ] **Step 2: SQL Editor에서 실행**

- [ ] **Step 3: 커밋**

```bash
git add supabase/ && git commit -m "feat: add RLS policies"
```

---

## Task 5: DB 함수 — 쪽지 발송 + 일일 포인트

**Files:**
- Create: `supabase/migrations/003_functions.sql`

- [ ] **Step 1: SQL 작성 후 실행**

```sql
-- supabase/migrations/003_functions.sql

-- 쪽지 발송: 포인트 차감 + 대화 생성 원자적 처리
CREATE OR REPLACE FUNCTION public.send_poke(
  p_receiver_id uuid,
  p_post_id     uuid,
  p_content     text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_sender_id      uuid := auth.uid();
  v_balance        integer;
  v_conversation_id uuid;
BEGIN
  -- 잔액 확인
  SELECT points_balance INTO v_balance FROM public.users WHERE id = v_sender_id;
  IF v_balance < 90 THEN
    RAISE EXCEPTION 'insufficient_points';
  END IF;

  -- 자기 자신에게 쪽지 방지
  IF v_sender_id = p_receiver_id THEN
    RAISE EXCEPTION 'cannot_poke_self';
  END IF;

  -- 포인트 차감
  UPDATE public.users SET points_balance = points_balance - 90 WHERE id = v_sender_id;

  -- 거래 내역 기록
  INSERT INTO public.point_transactions (user_id, amount, type, reference_id)
  VALUES (v_sender_id, -90, 'send_message', p_post_id);

  -- 대화 생성 (중복 시 기존 ID 반환)
  INSERT INTO public.conversations (sender_id, receiver_id, post_id, status)
  VALUES (v_sender_id, p_receiver_id, p_post_id, 'pending')
  ON CONFLICT (sender_id, post_id) DO NOTHING
  RETURNING id INTO v_conversation_id;

  IF v_conversation_id IS NULL THEN
    SELECT id INTO v_conversation_id FROM public.conversations
    WHERE sender_id = v_sender_id AND post_id = p_post_id;
  END IF;

  -- 첫 메시지 삽입
  INSERT INTO public.messages (conversation_id, sender_id, content)
  VALUES (v_conversation_id, v_sender_id, p_content);

  RETURN v_conversation_id;
END;
$$;

-- 답장 시 대화 status → active
CREATE OR REPLACE FUNCTION public.reply_to_poke(
  p_conversation_id uuid,
  p_content         text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_sender_id uuid := auth.uid();
  v_conv      public.conversations;
BEGIN
  SELECT * INTO v_conv FROM public.conversations WHERE id = p_conversation_id;

  -- 수신자만 답장 가능
  IF v_conv.receiver_id != v_sender_id THEN
    RAISE EXCEPTION 'not_receiver';
  END IF;

  -- 대화 활성화
  UPDATE public.conversations SET status = 'active' WHERE id = p_conversation_id;

  -- 메시지 삽입
  INSERT INTO public.messages (conversation_id, sender_id, content)
  VALUES (p_conversation_id, v_sender_id, p_content);
END;
$$;

-- 일일 포인트 지급 (pg_cron으로 호출)
CREATE OR REPLACE FUNCTION public.grant_daily_points() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- 오늘 이미 받은 유저 제외
  UPDATE public.users
  SET
    points_balance      = points_balance + 100,
    last_daily_grant_at = CURRENT_DATE
  WHERE last_daily_grant_at IS DISTINCT FROM CURRENT_DATE;

  INSERT INTO public.point_transactions (user_id, amount, type)
  SELECT id, 100, 'daily_grant'
  FROM public.users
  WHERE last_daily_grant_at = CURRENT_DATE
    AND created_at < now() - interval '1 second';
END;
$$;

-- pg_cron 스케줄 (Supabase Pro 이상)
SELECT cron.schedule('daily-points', '0 15 * * *', 'SELECT public.grant_daily_points()');
-- UTC 15:00 = KST 00:00
```

- [ ] **Step 2: SQL Editor에서 실행**

- [ ] **Step 3: 커밋**

```bash
git add supabase/ && git commit -m "feat: add DB functions and cron"
```

---

## Task 6: Supabase 클라이언트 설정

**Files:**
- Create: `lib/supabase.ts`
- Create: `.env.local`

- [ ] **Step 1: 환경변수 파일 생성**

```bash
# .env.local  (git에 커밋하지 않음)
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

- [ ] **Step 2: .gitignore에 추가**

```
.env.local
```

- [ ] **Step 3: Supabase 클라이언트 작성**

```typescript
// lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

- [ ] **Step 4: 커밋**

```bash
git add lib/supabase.ts .gitignore && git commit -m "feat: add supabase client"
```

---

## Task 7: Auth Store (Zustand)

**Files:**
- Create: `stores/authStore.ts`
- Create: `stores/pointsStore.ts`

- [ ] **Step 1: authStore 작성**

```typescript
// stores/authStore.ts
import { create } from 'zustand'
import { User } from '../types'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      set({ user: null, loading: false })
      return
    }
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()
    set({ user: data, loading: false })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
```

- [ ] **Step 2: pointsStore 작성**

```typescript
// stores/pointsStore.ts
import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface PointsState {
  balance: number
  setBalance: (balance: number) => void
  refresh: (userId: string) => Promise<void>
}

export const usePointsStore = create<PointsState>((set) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  refresh: async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', userId)
      .single()
    if (data) set({ balance: data.points_balance })
  },
}))
```

- [ ] **Step 3: 커밋**

```bash
git add stores/ && git commit -m "feat: add auth and points stores"
```

---

## Task 8: Root Layout — Auth Gate

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Root layout 작성**

```typescript
// app/_layout.tsx
import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export default function RootLayout() {
  const { user, loading, fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await fetchUser()
        } else if (event === 'SIGNED_OUT') {
          router.replace('/(auth)/phone')
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/(auth)/phone')
    } else {
      router.replace('/(tabs)/board')
    }
  }, [user, loading])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add app/_layout.tsx && git commit -m "feat: add auth gate in root layout"
```

---

## Task 9: Auth 화면 — 전화번호 + OTP

**Files:**
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(auth)/phone.tsx`
- Create: `app/(auth)/verify.tsx`

- [ ] **Step 1: auth layout**

```typescript
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router'
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
```

- [ ] **Step 2: 전화번호 입력 화면**

```typescript
// app/(auth)/phone.tsx
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function PhoneScreen() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async () => {
    const formatted = phone.startsWith('+') ? phone : `+82${phone.replace(/^0/, '')}`
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    setLoading(false)
    if (error) {
      Alert.alert('오류', error.message)
      return
    }
    router.push({ pathname: '/(auth)/verify', params: { phone: formatted } })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>휴대폰 번호 입력</Text>
      <TextInput
        style={styles.input}
        placeholder="010-0000-0000"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading || phone.length < 10}
      >
        <Text style={styles.buttonText}>{loading ? '전송 중...' : '인증번호 받기'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 16, fontSize: 16, marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6B6B', borderRadius: 8,
    padding: 16, alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
```

- [ ] **Step 3: OTP 인증 화면**

```typescript
// app/(auth)/verify.tsx
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const { fetchUser } = useAuthStore()

  const handleVerify = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })
    setLoading(false)
    if (error) {
      Alert.alert('인증 실패', error.message)
      return
    }

    // 신규 유저인지 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user!.id)
      .single()

    if (!existingUser) {
      router.replace({ pathname: '/(auth)/setup', params: { phone } })
    } else {
      await fetchUser()
      router.replace('/(tabs)/board')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>인증번호 입력</Text>
      <Text style={styles.subtitle}>{phone}으로 전송된 인증번호를 입력하세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
        value={token}
        onChangeText={setToken}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading || token.length !== 6}
      >
        <Text style={styles.buttonText}>{loading ? '확인 중...' : '확인'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 16, fontSize: 24, textAlign: 'center', marginBottom: 16, letterSpacing: 8,
  },
  button: {
    backgroundColor: '#FF6B6B', borderRadius: 8,
    padding: 16, alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
```

- [ ] **Step 4: 수동 테스트**

```
1. 앱 실행 → phone 화면 표시 확인
2. 전화번호 입력 → OTP SMS 수신 확인 (Supabase 대시보드에서 Twilio 연결 필요)
3. OTP 입력 → verify 성공 → setup으로 이동 확인
```

- [ ] **Step 5: 커밋**

```bash
git add app/\(auth\)/ && git commit -m "feat: add SMS auth screens"
```

---

## Task 10: 프로필 설정 화면

**Files:**
- Create: `app/(auth)/setup.tsx`

- [ ] **Step 1: setup.tsx 작성**

```typescript
// app/(auth)/setup.tsx
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Gender } from '../../types'

export default function SetupScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<Gender | null>(null)
  const [birthDate, setBirthDate] = useState('')  // YYYYMMDD 입력 → YYYY-MM-DD 변환
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const { fetchUser } = useAuthStore()

  const handleComplete = async () => {
    if (!gender || birthDate.length !== 8) {
      Alert.alert('오류', '모든 항목을 입력해주세요.')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setLoading(true)
    const formattedDate = `${birthDate.slice(0,4)}-${birthDate.slice(4,6)}-${birthDate.slice(6,8)}`

    const { error } = await supabase.from('users').insert({
      id: user.id,
      nickname: nickname.trim(),
      gender,
      birth_date: formattedDate,
      phone,
      region: region.trim() || null,
    })
    setLoading(false)

    if (error) {
      if (error.code === '23505') {
        Alert.alert('오류', '이미 사용 중인 닉네임입니다.')
      } else {
        Alert.alert('오류', error.message)
      }
      return
    }

    await fetchUser()
    router.replace('/(tabs)/board')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>프로필 설정</Text>

      <Text style={styles.label}>닉네임</Text>
      <TextInput style={styles.input} value={nickname} onChangeText={setNickname} maxLength={10} />

      <Text style={styles.label}>성별</Text>
      <View style={styles.genderRow}>
        {(['M', 'F'] as Gender[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
              {g === 'M' ? '남성' : '여성'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>생년월일 (8자리, 예: 19990101)</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
        keyboardType="number-pad"
        maxLength={8}
        placeholder="19990101"
      />

      <Text style={styles.label}>동네 (구/동, 선택)</Text>
      <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="예: 강남구" />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading || !nickname || !gender || birthDate.length !== 8}
      >
        <Text style={styles.buttonText}>{loading ? '저장 중...' : '시작하기'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 32 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 14, fontSize: 16,
  },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: {
    flex: 1, padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  genderBtnActive: { borderColor: '#FF6B6B', backgroundColor: '#FFF0F0' },
  genderText: { fontSize: 16, color: '#333' },
  genderTextActive: { color: '#FF6B6B', fontWeight: '600' },
  button: {
    backgroundColor: '#FF6B6B', borderRadius: 8,
    padding: 16, alignItems: 'center', marginTop: 32,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
```

- [ ] **Step 2: 커밋**

```bash
git add app/\(auth\)/setup.tsx && git commit -m "feat: add profile setup screen"
```

---

## Task 11: 포인트 라이브러리 + 테스트

**Files:**
- Create: `lib/points.ts`
- Create: `__tests__/points.test.ts`

- [ ] **Step 1: 테스트 먼저 작성**

```typescript
// __tests__/points.test.ts
import { calculateAge, isEnoughPoints } from '../lib/points'

describe('calculateAge', () => {
  it('생년월일로 나이 계산', () => {
    const age = calculateAge('2000-01-01')
    expect(age).toBeGreaterThanOrEqual(25)
  })

  it('올해 생일 전이면 나이 1 적게', () => {
    const thisYear = new Date().getFullYear()
    const futureMonth = String(new Date().getMonth() + 2).padStart(2, '0')
    const birthDate = `${thisYear - 20}-${futureMonth}-01`
    expect(calculateAge(birthDate)).toBe(19)
  })
})

describe('isEnoughPoints', () => {
  it('90p 이상이면 true', () => {
    expect(isEnoughPoints(90)).toBe(true)
    expect(isEnoughPoints(1000)).toBe(true)
  })

  it('90p 미만이면 false', () => {
    expect(isEnoughPoints(89)).toBe(false)
    expect(isEnoughPoints(0)).toBe(false)
  })
})
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
npx jest __tests__/points.test.ts
# Expected: FAIL — calculateAge, isEnoughPoints not defined
```

- [ ] **Step 3: 구현**

```typescript
// lib/points.ts
import { supabase } from './supabase'
import { POKE_COST } from '../constants'

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function isEnoughPoints(balance: number): boolean {
  return balance >= POKE_COST
}

export async function purchasePoints(userId: string, points: number, purchaseId: string): Promise<void> {
  const { error } = await supabase.rpc('add_purchased_points', {
    p_user_id: userId,
    p_points: points,
    p_purchase_id: purchaseId,
  })
  if (error) throw error
}
```

- [ ] **Step 4: 테스트 실행 → 통과 확인**

```bash
npx jest __tests__/points.test.ts
# Expected: PASS
```

- [ ] **Step 5: add_purchased_points 함수 DB에 추가**

SQL Editor에서:
```sql
CREATE OR REPLACE FUNCTION public.add_purchased_points(
  p_user_id   uuid,
  p_points    integer,
  p_purchase_id text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.users SET points_balance = points_balance + p_points WHERE id = p_user_id;
  INSERT INTO public.point_transactions (user_id, amount, type, reference_id)
  VALUES (p_user_id, p_points, 'purchase', p_purchase_id::uuid);
END;
$$;
```

- [ ] **Step 6: 커밋**

```bash
git add lib/points.ts __tests__/points.test.ts && git commit -m "feat: add points library with tests"
```

---

## Task 12: 게시글 라이브러리

**Files:**
- Create: `lib/posts.ts`
- Create: `lib/storage.ts`

- [ ] **Step 1: storage.ts**

```typescript
// lib/storage.ts
import * as ImagePicker from 'expo-image-picker'
import { supabase } from './supabase'
import { decode } from 'base64-arraybuffer'

export async function pickImages(max = 3): Promise<string[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.7,
    base64: true,
    selectionLimit: max,
  })
  if (result.canceled) return []
  return result.assets.map((a) => a.uri)
}

export async function uploadImage(uri: string, userId: string): Promise<string> {
  const base64 = await uriToBase64(uri)
  const filename = `${userId}/${Date.now()}.jpg`

  const { error } = await supabase.storage
    .from('images')
    .upload(filename, decode(base64), { contentType: 'image/jpeg' })

  if (error) throw error

  const { data } = supabase.storage.from('images').getPublicUrl(filename)
  return data.publicUrl
}

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
```

- [ ] **Step 2: posts.ts**

```typescript
// lib/posts.ts
import { supabase } from './supabase'
import { Post, FilterType } from '../types'

export async function fetchPosts(filter: FilterType, userRegion?: string | null): Promise<Post[]> {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:users!user_id (nickname, gender, birth_date, profile_photos)
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  if (filter === 'nearby' && userRegion) {
    query = query.eq('location_region', userRegion)
  } else if (filter === 'recent') {
    // 최근 접속 기준: 1시간 내 접속한 유저의 글
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    query = query.gte('users.last_active_at', oneHourAgo)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Post[]
}

export async function createPost(params: {
  content: string
  images: string[]
  category: Post['category']
  region?: string | null
}): Promise<Post> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not_authenticated')

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: params.content,
      images: params.images,
      category: params.category,
      location_region: params.region ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Post
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw error
}

export async function updateLastActive(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('users').update({ last_active_at: new Date().toISOString() }).eq('id', user.id)
}
```

- [ ] **Step 3: 커밋**

```bash
git add lib/posts.ts lib/storage.ts && git commit -m "feat: add posts and storage library"
```

---

## Task 13: 바텀 탭 레이아웃

**Files:**
- Create: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: 탭 레이아웃 작성**

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="board"
        options={{
          title: '게시판',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: '채팅',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '알림',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '마이',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add app/\(tabs\)/_layout.tsx && git commit -m "feat: add tab navigation"
```

---

## Task 14: PostCard + FilterChips 컴포넌트

**Files:**
- Create: `components/board/PostCard.tsx`
- Create: `components/board/FilterChips.tsx`

- [ ] **Step 1: PostCard.tsx**

```typescript
// components/board/PostCard.tsx
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Post } from '../../types'
import { calculateAge } from '../../lib/points'
import { POKE_COST } from '../../constants'

interface Props {
  post: Post
  currentUserId: string
  onPoke: (post: Post) => void
}

export function PostCard({ post, currentUserId, onPoke }: Props) {
  const author = post.author
  const age = author ? calculateAge(author.birth_date) : 0
  const isOwn = post.user_id === currentUserId

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {author?.profile_photos?.[0] ? (
            <Image source={{ uri: author.profile_photos[0] }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>{author?.nickname?.[0] ?? '?'}</Text>
          )}
        </View>
        <View>
          <Text style={styles.nickname}>{author?.nickname}</Text>
          <Text style={styles.meta}>
            {author?.gender === 'M' ? '남' : '여'} · {age}세
          </Text>
        </View>
        <Text style={styles.category}>{post.category}</Text>
      </View>

      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      {post.images.length > 0 && (
        <Image source={{ uri: post.images[0] }} style={styles.thumbnail} />
      )}

      {!isOwn && (
        <TouchableOpacity style={styles.pokeButton} onPress={() => onPoke(post)}>
          <Text style={styles.pokeText}>쪽지 보내기 {POKE_COST}p</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginHorizontal: 16, marginVertical: 6,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFE0E0', justifyContent: 'center', alignItems: 'center',
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#FF6B6B' },
  nickname: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 13, color: '#999', marginTop: 2 },
  category: {
    marginLeft: 'auto', fontSize: 12, color: '#FF6B6B',
    backgroundColor: '#FFF0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  content: { fontSize: 15, lineHeight: 22, color: '#333', marginBottom: 12 },
  thumbnail: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12 },
  pokeButton: {
    backgroundColor: '#FF6B6B', borderRadius: 8,
    padding: 12, alignItems: 'center',
  },
  pokeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
})
```

- [ ] **Step 2: FilterChips.tsx**

```typescript
// components/board/FilterChips.tsx
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { FilterType } from '../../types'

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'nearby', label: '내 주변' },
  { id: 'recent', label: '최근 접속' },
]

interface Props {
  active: FilterType
  onChange: (filter: FilterType) => void
}

export function FilterChips({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.id}
          style={[styles.chip, active === f.id && styles.chipActive]}
          onPress={() => onChange(f.id)}
        >
          <Text style={[styles.chipText, active === f.id && styles.chipTextActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  content: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#f5f5f5',
  },
  chipActive: { backgroundColor: '#FFF0F0', borderColor: '#FF6B6B' },
  chipText: { fontSize: 14, color: '#666' },
  chipTextActive: { color: '#FF6B6B', fontWeight: '600' },
})
```

- [ ] **Step 3: 커밋**

```bash
git add components/board/ && git commit -m "feat: add PostCard and FilterChips"
```

---

## Task 15: 게시판 메인 화면

**Files:**
- Create: `app/(tabs)/board/index.tsx`

- [ ] **Step 1: board/index.tsx 작성**

```typescript
// app/(tabs)/board/index.tsx
import { useState, useEffect, useCallback } from 'react'
import {
  View, FlatList, TouchableOpacity, Text,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { PostCard } from '../../../components/board/PostCard'
import { FilterChips } from '../../../components/board/FilterChips'
import { PokeModal } from '../../../components/chat/PokeModal'
import { fetchPosts, updateLastActive } from '../../../lib/posts'
import { useAuthStore } from '../../../stores/authStore'
import { usePointsStore } from '../../../stores/pointsStore'
import { Post, FilterType } from '../../../types'

export default function BoardScreen() {
  const { user } = useAuthStore()
  const { balance, refresh: refreshPoints } = usePointsStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [pokeTarget, setPokeTarget] = useState<Post | null>(null)

  const loadPosts = useCallback(async () => {
    try {
      const data = await fetchPosts(filter, user?.region)
      setPosts(data)
    } catch (e) {
      Alert.alert('오류', '게시글을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter, user?.region])

  useEffect(() => {
    loadPosts()
    updateLastActive()
    if (user) refreshPoints(user.id)
  }, [loadPosts])

  const handleRefresh = () => {
    setRefreshing(true)
    loadPosts()
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>게시판</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{balance.toLocaleString()}p</Text>
        </View>
      </View>

      <FilterChips active={filter} onChange={setFilter} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id ?? ''}
            onPoke={setPokeTarget}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF6B6B" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 게시글이 없어요.</Text>
          </View>
        }
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
      />

      {/* 글쓰기 FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 쪽지 모달 */}
      {pokeTarget && (
        <PokeModal
          post={pokeTarget}
          balance={balance}
          onClose={() => setPokeTarget(null)}
          onSuccess={() => {
            setPokeTarget(null)
            if (user) refreshPoints(user.id)
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  pointsBadge: {
    backgroundColor: '#FFF0F0', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  pointsText: { color: '#FF6B6B', fontWeight: '700', fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { color: '#999', fontSize: 16 },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FF6B6B', shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
})
```

- [ ] **Step 2: 수동 테스트**

```
1. 앱 실행 → 게시판 탭 → 빈 리스트 표시 확인
2. 필터 칩 탭 → 필터 변경 확인
3. 상단 포인트 배지 → 잔액 표시 확인
4. FAB 탭 → 글쓰기 모달 표시 (다음 Task에서 구현)
```

- [ ] **Step 3: 커밋**

```bash
git add app/\(tabs\)/board/ && git commit -m "feat: add board screen"
```

---

## Task 16: 글쓰기 모달

**Files:**
- Create: `components/board/CreatePostModal.tsx`
- Modify: `app/(tabs)/board/index.tsx`

- [ ] **Step 1: CreatePostModal.tsx 작성**

```typescript
// components/board/CreatePostModal.tsx
import { useState } from 'react'
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Image, ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { createPost } from '../../lib/posts'
import { pickImages, uploadImage } from '../../lib/storage'
import { useAuthStore } from '../../stores/authStore'
import { PostCategory } from '../../types'

const CATEGORIES: PostCategory[] = ['일상', '고민', '만남']

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreatePostModal({ visible, onClose, onSuccess }: Props) {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('일상')
  const [images, setImages] = useState<string[]>([])  // 로컬 URI
  const [loading, setLoading] = useState(false)

  const handlePickImages = async () => {
    if (images.length >= 3) {
      Alert.alert('알림', '사진은 최대 3장입니다.')
      return
    }
    const uris = await pickImages(3 - images.length)
    setImages((prev) => [...prev, ...uris].slice(0, 3))
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      // 이미지 업로드
      const uploadedUrls = await Promise.all(
        images.map((uri) => uploadImage(uri, user!.id))
      )
      await createPost({
        content: content.trim(),
        images: uploadedUrls,
        category,
        region: user?.region,
      })
      setContent('')
      setImages([])
      setCategory('일상')
      onSuccess()
    } catch (e) {
      Alert.alert('오류', '게시글 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>글쓰기</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={[styles.submit, loading && { opacity: 0.5 }]}>
              {loading ? '...' : '게시'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body}>
          {/* 카테고리 */}
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.catChip, category === c && styles.catChipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="무슨 생각을 하고 계세요?"
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={500}
          />

          {/* 이미지 미리보기 */}
          <View style={styles.imageRow}>
            {images.map((uri, i) => (
              <View key={i} style={styles.imageWrap}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImg}
                  onPress={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                >
                  <Ionicons name="close-circle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 3 && (
              <TouchableOpacity style={styles.addImage} onPress={handlePickImages}>
                <Ionicons name="camera-outline" size={24} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  cancel: { fontSize: 16, color: '#666' },
  title: { fontSize: 17, fontWeight: '700' },
  submit: { fontSize: 16, color: '#FF6B6B', fontWeight: '700' },
  body: { flex: 1, padding: 16 },
  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  catChipActive: { backgroundColor: '#FF6B6B' },
  catText: { fontSize: 14, color: '#666' },
  catTextActive: { color: '#fff', fontWeight: '600' },
  textInput: { fontSize: 16, lineHeight: 24, minHeight: 150, textAlignVertical: 'top' },
  imageRow: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  imageWrap: { position: 'relative' },
  image: { width: 90, height: 90, borderRadius: 8 },
  removeImg: { position: 'absolute', top: -6, right: -6 },
  addImage: {
    width: 90, height: 90, borderRadius: 8, borderWidth: 1,
    borderColor: '#ddd', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
})
```

- [ ] **Step 2: board/index.tsx에서 CreatePostModal 연결**

```typescript
// app/(tabs)/board/index.tsx 상단 import 추가
import { CreatePostModal } from '../../../components/board/CreatePostModal'

// JSX에서 PokeModal 아래에 추가
<CreatePostModal
  visible={showCreate}
  onClose={() => setShowCreate(false)}
  onSuccess={() => {
    setShowCreate(false)
    loadPosts()
  }}
/>
```

- [ ] **Step 3: 수동 테스트**

```
1. FAB 탭 → 글쓰기 모달 표시
2. 카테고리 선택 → 색상 변경 확인
3. 내용 입력 + 사진 추가 → 게시 탭
4. 게시판 새로고침 → 내 글 표시 확인
```

- [ ] **Step 4: 커밋**

```bash
git add components/board/CreatePostModal.tsx app/\(tabs\)/board/index.tsx
git commit -m "feat: add create post modal"
```

---

## Task 17: 쪽지(Poke) 모달

**Files:**
- Create: `components/chat/PokeModal.tsx`

- [ ] **Step 1: PokeModal.tsx 작성**

```typescript
// components/chat/PokeModal.tsx
import { useState } from 'react'
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { isEnoughPoints } from '../../lib/points'
import { Post } from '../../types'
import { POKE_COST } from '../../constants'

interface Props {
  post: Post
  balance: number
  onClose: () => void
  onSuccess: () => void
}

export function PokeModal({ post, balance, onClose, onSuccess }: Props) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const enough = isEnoughPoints(balance)

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('알림', '메시지를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('send_poke', {
        p_receiver_id: post.user_id,
        p_post_id: post.id,
        p_content: message.trim(),
      })
      if (error) {
        if (error.message.includes('insufficient_points')) {
          Alert.alert('포인트 부족', '쪽지를 보내려면 90p가 필요합니다.', [
            { text: '충전하기', onPress: () => { onClose(); router.push('/profile') } },
            { text: '취소', style: 'cancel' },
          ])
        } else {
          Alert.alert('오류', error.message)
        }
        return
      }
      onSuccess()
      Alert.alert('전송 완료', '쪽지를 보냈습니다. 상대방의 답장을 기다려보세요!')
      router.push({ pathname: '/(tabs)/chats/[id]', params: { id: data } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>쪽지 보내기</Text>
          <Text style={styles.subtitle}>
            {post.author?.nickname}님의 글에 쪽지를 보냅니다.
          </Text>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>현재 포인트</Text>
            <Text style={[styles.balance, !enough && styles.balanceLow]}>
              {balance.toLocaleString()}p
            </Text>
          </View>

          {!enough ? (
            <View style={styles.lowAlert}>
              <Text style={styles.lowText}>포인트가 부족합니다. (필요: {POKE_COST}p)</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="첫 인사를 보내보세요..."
                multiline
                maxLength={200}
                value={message}
                onChangeText={setMessage}
              />
              <Text style={styles.cost}>{POKE_COST}p가 차감됩니다.</Text>
            </>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            {enough && (
              <TouchableOpacity
                style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.sendText}>보내기 ({POKE_COST}p)</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 40,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  balanceLabel: { fontSize: 14, color: '#666' },
  balance: { fontSize: 16, fontWeight: '700', color: '#333' },
  balanceLow: { color: '#FF3B30' },
  lowAlert: {
    backgroundColor: '#FFF0F0', borderRadius: 8, padding: 12, marginBottom: 16,
  },
  lowText: { color: '#FF3B30', fontSize: 14 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top', marginBottom: 8,
  },
  cost: { fontSize: 13, color: '#999', textAlign: 'right', marginBottom: 20 },
  buttons: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: '#666' },
  sendBtn: {
    flex: 2, padding: 14, borderRadius: 12,
    backgroundColor: '#FF6B6B', alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendText: { fontSize: 16, color: '#fff', fontWeight: '700' },
})
```

- [ ] **Step 2: 수동 테스트**

```
1. 타인 게시글 → "쪽지 보내기 90p" 탭 → 모달 열림
2. 포인트 충분 → 메시지 입력 → 보내기 → 차감 확인
3. 포인트 부족 → "포인트가 부족합니다" 표시 확인
4. 보내기 성공 → 채팅 화면으로 이동 확인
```

- [ ] **Step 3: 커밋**

```bash
git add components/chat/PokeModal.tsx && git commit -m "feat: add poke modal with point deduction"
```

---

## Task 18: 채팅 스레드 화면 (Realtime)

**Files:**
- Create: `lib/conversations.ts`
- Create: `components/chat/MessageBubble.tsx`
- Create: `components/chat/ChatInput.tsx`
- Create: `app/(tabs)/chats/[id].tsx`

- [ ] **Step 1: conversations.ts**

```typescript
// lib/conversations.ts
import { supabase } from './supabase'
import { Conversation, Message } from '../types'

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      other_user:users!sender_id (nickname, gender, birth_date, profile_photos),
      last_message:messages (content, created_at)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Conversation[]
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as Message[]
}

export async function sendMessage(conversationId: string, content: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not_authenticated')

  const { data: conv } = await supabase
    .from('conversations')
    .select('status, receiver_id')
    .eq('id', conversationId)
    .single()

  // 수신자가 처음 답장하는 경우 → reply_to_poke RPC 사용
  if (conv?.status === 'pending' && conv?.receiver_id === user.id) {
    const { error } = await supabase.rpc('reply_to_poke', {
      p_conversation_id: conversationId,
      p_content: content,
    })
    if (error) throw error
    return
  }

  // 이미 active인 대화
  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content })

  if (error) throw error
}

export function subscribeToMessages(
  conversationId: string,
  onMessage: (msg: Message) => void
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe()
}
```

- [ ] **Step 2: MessageBubble.tsx**

```typescript
// components/chat/MessageBubble.tsx
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  content: string
  isMe: boolean
  createdAt: string
}

export function MessageBubble({ content, isMe, createdAt }: Props) {
  const time = new Date(createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <View style={[styles.row, isMe && styles.rowMe]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.text, isMe && styles.textMe]}>{content}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4, paddingHorizontal: 16, gap: 6 },
  rowMe: { flexDirection: 'row-reverse' },
  bubble: {
    maxWidth: '75%', padding: 12, borderRadius: 16,
    backgroundColor: '#f0f0f0', borderBottomLeftRadius: 4,
  },
  bubbleMe: { backgroundColor: '#FF6B6B', borderBottomLeftRadius: 16, borderBottomRightRadius: 4 },
  bubbleThem: {},
  text: { fontSize: 15, lineHeight: 20, color: '#333' },
  textMe: { color: '#fff' },
  time: { fontSize: 11, color: '#999' },
})
```

- [ ] **Step 3: ChatInput.tsx**

```typescript
// components/chat/ChatInput.tsx
import { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="메시지를 입력하세요..."
        multiline
        maxLength={500}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.sendBtn, (!text.trim() || disabled) && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#ddd' },
})
```

- [ ] **Step 4: 채팅 스레드 화면**

```typescript
// app/(tabs)/chats/[id].tsx
import { useState, useEffect, useRef } from 'react'
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { MessageBubble } from '../../../components/chat/MessageBubble'
import { ChatInput } from '../../../components/chat/ChatInput'
import { fetchMessages, sendMessage, subscribeToMessages } from '../../../lib/conversations'
import { useAuthStore } from '../../../stores/authStore'
import { Message } from '../../../types'

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    fetchMessages(id).then((data) => {
      setMessages(data)
      setLoading(false)
    })

    const channel = subscribeToMessages(id, (msg) => {
      setMessages((prev) => [...prev, msg])
      listRef.current?.scrollToEnd({ animated: true })
    })

    return () => { supabase.removeChannel(channel) }
  }, [id])

  const handleSend = async (text: string) => {
    setSending(true)
    try {
      await sendMessage(id, text)
    } catch (e) {
      Alert.alert('오류', '메시지 전송에 실패했습니다.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color="#FF6B6B" /></View>
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ title: '채팅', headerShown: true }} />
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            content={item.content}
            isMe={item.sender_id === user?.id}
            createdAt={item.created_at}
          />
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd()}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
      <ChatInput onSend={handleSend} disabled={sending} />
    </KeyboardAvoidingView>
  )
}

// supabase import 누락 수정
import { supabase } from '../../../lib/supabase'

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
```

- [ ] **Step 5: 수동 테스트**

```
1. 쪽지 전송 → 채팅 화면 이동 → 첫 메시지 표시 확인
2. 다른 기기/계정에서 앱 실행 → 쪽지 받은 유저로 로그인
3. 채팅함 탭 → 대화 표시 (현재 pending 상태)
4. 답장 입력 → 전송 → 양쪽 모두 실시간으로 메시지 수신 확인
5. Supabase 대시보드 → conversations.status = 'active' 변경 확인
```

- [ ] **Step 6: 커밋**

```bash
git add lib/conversations.ts components/chat/ app/\(tabs\)/chats/
git commit -m "feat: add realtime chat screen"
```

---

## Task 19: 채팅함 (대화 목록)

**Files:**
- Create: `app/(tabs)/chats/index.tsx`

- [ ] **Step 1: chats/index.tsx 작성**

```typescript
// app/(tabs)/chats/index.tsx
import { useState, useEffect } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image,
} from 'react-native'
import { router } from 'expo-router'
import { fetchConversations } from '../../../lib/conversations'
import { useAuthStore } from '../../../stores/authStore'
import { Conversation } from '../../../types'
import { calculateAge } from '../../../lib/points'

export default function ChatsScreen() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchConversations(user.id)
      .then(setConversations)
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color="#FF6B6B" /></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const other = item.other_user
          const age = other ? calculateAge(other.birth_date) : 0
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push({ pathname: '/(tabs)/chats/[id]', params: { id: item.id } })}
            >
              <View style={styles.avatar}>
                {other?.profile_photos?.[0] ? (
                  <Image source={{ uri: other.profile_photos[0] }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>{other?.nickname?.[0] ?? '?'}</Text>
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>
                  {other?.nickname} · {other?.gender === 'M' ? '남' : '여'} {age}
                </Text>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.last_message ?? '대화를 시작해보세요.'}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>진행 중인 채팅이 없어요.</Text>
            <Text style={styles.emptyHint}>게시판에서 쪽지를 보내보세요!</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', gap: 12,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#FFE0E0', justifyContent: 'center', alignItems: 'center',
  },
  avatarImg: { width: 52, height: 52, borderRadius: 26 },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#FF6B6B' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  lastMsg: { fontSize: 14, color: '#999' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#999' },
})
```

- [ ] **Step 2: 커밋**

```bash
git add app/\(tabs\)/chats/index.tsx && git commit -m "feat: add chat list screen"
```

---

## Task 20: 마이페이지

**Files:**
- Create: `app/(tabs)/profile/index.tsx`

- [ ] **Step 1: profile/index.tsx 작성**

```typescript
// app/(tabs)/profile/index.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '../../../stores/authStore'
import { usePointsStore } from '../../../stores/pointsStore'
import { calculateAge } from '../../../lib/points'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore()
  const { balance } = usePointsStore()

  if (!user) return null

  const handleSignOut = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', onPress: signOut },
    ])
  }

  const age = calculateAge(user.birth_date)

  const menuItems = [
    { icon: 'create-outline', label: '닉네임 변경', onPress: () => {} },
    { icon: 'location-outline', label: '동네 설정', onPress: () => {} },
    { icon: 'notifications-outline', label: '알림 설정', onPress: () => {} },
    { icon: 'ban-outline', label: '차단 목록', onPress: () => {} },
    { icon: 'flag-outline', label: '신고 내역', onPress: () => {} },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {user.profile_photos?.[0] ? (
            <Image source={{ uri: user.profile_photos[0] }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>{user.nickname[0]}</Text>
          )}
        </View>
        <Text style={styles.nickname}>{user.nickname}</Text>
        <Text style={styles.meta}>{user.gender === 'M' ? '남성' : '여성'} · {age}세</Text>
        {user.region && <Text style={styles.region}>{user.region}</Text>}
      </View>

      {/* 포인트 카드 */}
      <View style={styles.pointsCard}>
        <View>
          <Text style={styles.pointsLabel}>보유 포인트</Text>
          <Text style={styles.pointsValue}>{balance.toLocaleString()}p</Text>
        </View>
        <TouchableOpacity style={styles.chargeBtn} onPress={() => router.push('/charge')}>
          <Text style={styles.chargeText}>충전하기</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 */}
      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
            <Ionicons name={item.icon as any} size={20} color="#666" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 24, backgroundColor: '#fff' },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFE0E0', justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarImg: { width: 80, height: 80, borderRadius: 40 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#FF6B6B' },
  nickname: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  meta: { fontSize: 14, color: '#666', marginBottom: 4 },
  region: { fontSize: 13, color: '#999' },
  pointsCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FF6B6B', margin: 16, borderRadius: 16, padding: 20,
  },
  pointsLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  pointsValue: { fontSize: 24, fontWeight: '700', color: '#fff' },
  chargeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  chargeText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  menu: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  menuLabel: { fontSize: 15, color: '#333' },
  signOutBtn: { margin: 16, padding: 16, alignItems: 'center' },
  signOutText: { color: '#999', fontSize: 15 },
})
```

- [ ] **Step 2: 커밋**

```bash
git add app/\(tabs\)/profile/ && git commit -m "feat: add profile screen"
```

---

## Task 21: 알림 화면 + 신고/차단

**Files:**
- Create: `app/(tabs)/notifications/index.tsx`
- Create: `lib/safety.ts`

- [ ] **Step 1: safety.ts**

```typescript
// lib/safety.ts
import { supabase } from './supabase'

export async function reportUser(targetId: string, reason: string): Promise<void> {
  const { error } = await supabase.from('reports').insert({ target_id: targetId, reason })
  if (error) throw error
}

export async function blockUser(blockedId: string): Promise<void> {
  const { error } = await supabase.from('blocks').insert({ blocked_id: blockedId })
  if (error) throw error
}

export async function unblockUser(blockedId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('blocks')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedId)
}
```

- [ ] **Step 2: notifications/index.tsx (기본 구조)**

```typescript
// app/(tabs)/notifications/index.tsx
import { View, Text, StyleSheet } from 'react-native'

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>알림</Text>
      </View>
      <View style={styles.empty}>
        <Text style={styles.emptyText}>새로운 알림이 없어요.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
})
```

- [ ] **Step 3: PostCard에 신고/차단 ActionSheet 추가**

PostCard.tsx에 롱프레스 핸들러 추가:
```typescript
// components/board/PostCard.tsx — onLongPress 추가
import { Alert } from 'react-native'
import { reportUser, blockUser } from '../../lib/safety'

// TouchableOpacity로 카드 전체 감싸고 onLongPress 연결:
const handleLongPress = () => {
  if (post.user_id === currentUserId) return
  Alert.alert('신고/차단', `${post.author?.nickname}님을`, [
    { text: '취소', style: 'cancel' },
    {
      text: '신고하기', style: 'destructive',
      onPress: () => Alert.prompt('신고 사유', '', async (reason) => {
        if (reason) await reportUser(post.user_id, reason)
      }),
    },
    {
      text: '차단하기', style: 'destructive',
      onPress: () => Alert.alert('차단', '이 유저의 글이 보이지 않습니다.', [
        { text: '취소', style: 'cancel' },
        { text: '차단', onPress: () => blockUser(post.user_id) },
      ]),
    },
  ])
}
```

- [ ] **Step 4: 커밋**

```bash
git add app/\(tabs\)/notifications/ lib/safety.ts components/board/PostCard.tsx
git commit -m "feat: add notifications screen and report/block"
```

---

## Task 22: RevenueCat IAP 포인트 충전

**Files:**
- Create: `app/charge.tsx` (모달 화면)

- [ ] **Step 1: RevenueCat 프로젝트 설정**

```
1. app.revenuecat.com → 새 프로젝트
2. iOS App Store Connect + Google Play Console에서 인앱 결제 상품 생성:
   - points_1000 (₩1,000)
   - points_5500 (₩5,000)
   - points_12000 (₩10,000)
3. RevenueCat에 상품 연동
4. API key 복사 → .env.local에 추가:
   EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxx
   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxx
```

- [ ] **Step 2: RevenueCat 초기화 — app/_layout.tsx 수정**

```typescript
// app/_layout.tsx — useEffect 상단에 추가
import Purchases, { LOG_LEVEL } from 'react-native-purchases'
import { Platform } from 'react-native'

useEffect(() => {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG)
  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY! })
  } else {
    Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY! })
  }
}, [])
```

- [ ] **Step 3: charge.tsx 작성**

```typescript
// app/charge.tsx
import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { purchasePoints } from '../lib/points'
import { useAuthStore } from '../stores/authStore'
import { usePointsStore } from '../stores/pointsStore'
import { POINT_PACKAGES } from '../constants'

// RevenueCat 패키지 ID → 포인트 매핑
const PACKAGE_POINTS: Record<string, number> = {
  points_1000: 1000,
  points_5500: 5500,
  points_12000: 12000,
}

export default function ChargeScreen() {
  const { user } = useAuthStore()
  const { refresh } = usePointsStore()
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    Purchases.getOfferings().then((offerings) => {
      const pkgs = offerings.current?.availablePackages ?? []
      setPackages(pkgs)
      setLoading(false)
    })
  }, [])

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setPurchasing(pkg.identifier)
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      const points = PACKAGE_POINTS[pkg.identifier] ?? 0

      if (points > 0 && user) {
        await purchasePoints(user.id, points, customerInfo.originalAppUserId)
        await refresh(user.id)
        Alert.alert('충전 완료', `${points.toLocaleString()}p가 충전되었습니다!`, [
          { text: '확인', onPress: () => router.back() },
        ])
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('오류', '결제에 실패했습니다.')
      }
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color="#FF6B6B" /></View>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>포인트 충전</Text>
        <Text style={styles.subtitle}>1p = 1원 · 쪽지 1건 = 90p</Text>
      </View>

      {POINT_PACKAGES.map((item) => {
        const pkg = packages.find((p) => p.identifier === item.id)
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.packageCard}
            onPress={() => pkg && handlePurchase(pkg)}
            disabled={!!purchasing || !pkg}
          >
            <View>
              <Text style={styles.packagePoints}>{item.points.toLocaleString()}p</Text>
              {item.bonus > 0 && (
                <Text style={styles.bonus}>+{item.bonus.toLocaleString()}p 보너스</Text>
              )}
            </View>
            {purchasing === item.id ? (
              <ActivityIndicator color="#FF6B6B" />
            ) : (
              <Text style={styles.price}>₩{item.priceKRW.toLocaleString()}</Text>
            )}
          </TouchableOpacity>
        )
      })}

      <Text style={styles.notice}>
        결제는 App Store / Google Play를 통해 이루어집니다.
        구매한 포인트는 환불되지 않습니다.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, backgroundColor: '#fff', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#999' },
  packageCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 6,
    padding: 20, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  packagePoints: { fontSize: 20, fontWeight: '700' },
  bonus: { fontSize: 13, color: '#FF6B6B', marginTop: 2 },
  price: { fontSize: 18, fontWeight: '700', color: '#FF6B6B' },
  notice: { fontSize: 12, color: '#999', margin: 20, lineHeight: 18, textAlign: 'center' },
})
```

- [ ] **Step 4: app.json에 charge 화면 route 등록 확인**

expo-router는 파일 기반이므로 `app/charge.tsx` 생성으로 자동 등록됨. 추가 설정 불필요.

- [ ] **Step 5: 수동 테스트 (TestFlight / 내부 테스트 트랙 필요)**

```
1. 마이페이지 → 충전하기 탭 → charge 화면 이동
2. 패키지 목록 표시 확인 (RevenueCat Sandbox 제품 필요)
3. 구매 탭 → 샌드박스 결제 진행
4. 포인트 잔액 증가 확인
```

- [ ] **Step 6: 커밋**

```bash
git add app/charge.tsx && git commit -m "feat: add RevenueCat IAP coin purchase"
```

---

## Task 23: EAS Build + 스토어 제출

**Files:**
- Create: `eas.json`

- [ ] **Step 1: EAS CLI 설치 및 로그인**

```bash
npm install -g eas-cli
eas login
eas build:configure
```

- [ ] **Step 2: eas.json 작성**

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false },
      "android": { "buildType": "apk" }
    },
    "production": {
      "ios": { "buildType": "release" },
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json"
      }
    }
  }
}
```

- [ ] **Step 3: 첫 프로덕션 빌드**

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

- [ ] **Step 4: 스토어 제출**

```bash
# iOS → TestFlight 먼저
eas submit --platform ios --profile production

# Android → 내부 테스트 트랙
eas submit --platform android --profile production
```

- [ ] **Step 5: 스토어 심사 준비 체크리스트**

```
App Store:
☐ 앱 아이콘 (1024x1024)
☐ 스크린샷 (iPhone 6.9", iPad)
☐ 개인정보처리방침 URL
☐ 연령 등급 설정 (소셜 기능으로 인해 17+ 권장)
☐ 앱 설명 (한국어)

Google Play:
☐ 앱 아이콘 (512x512)
☐ 피처드 이미지 (1024x500)
☐ 스크린샷 (핸드폰)
☐ 개인정보처리방침 URL
☐ 컨텐츠 등급 설문 완료
```

- [ ] **Step 6: 최종 커밋**

```bash
git add eas.json && git commit -m "chore: add EAS build config"
```

---

## 자체 검토 — Spec 커버리지

| 스펙 항목 | 구현 Task |
|-----------|-----------|
| Expo 프로젝트 초기 세팅 | Task 1 |
| Supabase 스키마 + RLS | Task 3, 4 |
| SMS 인증 가입/로그인 | Task 9, 10 |
| 게시판 CRUD + 사진 | Task 12, 15, 16 |
| 필터 (전체/주변/최근접속) | Task 14 |
| 쪽지 발송 (90p 차감) | Task 5, 17 |
| Supabase Realtime 채팅 | Task 18 |
| 일 100p 자동 지급 | Task 5 (pg_cron) |
| RevenueCat IAP 코인 충전 | Task 22 |
| 신고/차단 | Task 21 |
| EAS Build → 스토어 제출 | Task 23 |
| 바텀 탭 네비게이션 | Task 13 |
| 채팅함 | Task 19 |
| 마이페이지 | Task 20 |

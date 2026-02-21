/**
 * @file 表单验证组件规范
 * @description YYC³ 设计系统表单验证组件规范，确保表单数据安全和一致性
 * @module docs/form-validation
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# YYC³ 设计系统表单验证组件规范

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**创建日期**：2026-02-18
**作者**：YYC³ Team
**版本**：1.0.0
**更新日期**：2026-02-18

---

## 概述

本规范基于 YYC³ 团队「五高五标五化」核心要求，为设计系统表单验证组件提供统一标准，确保表单数据安全、一致、可验证。

## 核心原则

### 五高原则

#### 高可用
- 提供默认验证规则
- 支持自定义验证器
- 实现优雅的错误提示
- 支持离线验证

#### 高性能
- 实时验证反馈
- 防抖和节流优化
- 异步验证支持
- 缓存验证结果

#### 高安全
- 输入清理和过滤
- 防止 XSS 攻击
- SQL 注入防护
- CSRF 保护

#### 高扩展
- 可组合的验证规则
- 支持自定义验证器
- 多语言错误消息
- 插件化架构

#### 高可维护
- 清晰的验证规则定义
- 统一的错误处理
- 完整的类型定义
- 详细的文档和示例

## 验证规则

### 基础验证规则

#### 必填验证
```typescript
import { z } from 'zod';

const requiredSchema = z.string().min(1, '此字段为必填项');
```

#### 长度验证
```typescript
// 最小长度
const minLengthSchema = z.string().min(6, '至少需要6个字符');

// 最大长度
const maxLengthSchema = z.string().max(50, '最多50个字符');

// 范围长度
const lengthRangeSchema = z.string().min(6).max(50, '长度在6-50个字符之间');
```

#### 格式验证
```typescript
// 邮箱格式
const emailSchema = z.string().email('请输入有效的邮箱地址');

// URL 格式
const urlSchema = z.string().url('请输入有效的URL');

// 手机号格式
const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号');

// 身份证格式
const idCardSchema = z.string().regex(
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  '请输入有效的身份证号'
);
```

#### 数值验证
```typescript
// 最小值
const minNumberSchema = z.number().min(0, '值不能小于0');

// 最大值
const maxNumberSchema = z.number().max(100, '值不能大于100');

// 范围值
const rangeNumberSchema = z.number().min(0).max(100, '值在0-100之间');

// 整数
const integerSchema = z.number().int('请输入整数');

// 正数
const positiveSchema = z.number().positive('请输入正数');
```

#### 日期验证
```typescript
// 日期格式
const dateSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  '请输入有效的日期'
);

// 最小日期
const minDateSchema = z.string().refine(
  (val) => new Date(val) >= new Date('2020-01-01'),
  '日期不能早于2020-01-01'
);

// 最大日期
const maxDateSchema = z.string().refine(
  (val) => new Date(val) <= new Date(),
  '日期不能晚于今天'
);
```

### 高级验证规则

#### 密码强度验证
```typescript
const passwordSchema = z.string()
  .min(8, '密码至少8个字符')
  .regex(/[A-Z]/, '密码必须包含大写字母')
  .regex(/[a-z]/, '密码必须包含小写字母')
  .regex(/[0-9]/, '密码必须包含数字')
  .regex(/[^A-Za-z0-9]/, '密码必须包含特殊字符');
```

#### 确认密码验证
```typescript
const passwordConfirmSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: '两次输入的密码不一致',
    path: ['confirmPassword']
  }
);
```

#### 自定义验证
```typescript
// 自定义验证器
const customValidator = z.string().refine(
  (val) => {
    // 自定义验证逻辑
    return val.startsWith('YYC3');
  },
  {
    message: '值必须以YYC3开头'
  }
);

// 异步验证
const asyncValidator = z.string().refine(
  async (val) => {
    const exists = await checkUsernameExists(val);
    return !exists;
  },
  {
    message: '用户名已存在'
  }
);
```

#### 条件验证
```typescript
// 基于其他字段的验证
const conditionalSchema = z.object({
  hasOtherOption: z.boolean(),
  otherOption: z.string().optional()
}).refine(
  (data) => {
    if (data.hasOtherOption) {
      return data.otherOption && data.otherOption.length > 0;
    }
    return true;
  },
  {
    message: '请填写其他选项',
    path: ['otherOption']
  }
);
```

## 表单验证组件

### Form 组件

#### 基础用法
```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@yyc3/design-system';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const schema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少8个字符')
});

export const UserForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const validated = schema.parse(data);
      await createUser(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField name="username">
        <FormItem>
          <FormLabel>用户名</FormLabel>
          <FormControl>
            <Input type="text" placeholder="请输入用户名" />
          </FormControl>
          <FormMessage>{errors.username}</FormMessage>
        </FormItem>
      </FormField>

      <FormField name="email">
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl>
            <Input type="email" placeholder="请输入邮箱" />
          </FormControl>
          <FormMessage>{errors.email}</FormMessage>
        </FormItem>
      </FormField>

      <FormField name="password">
        <FormItem>
          <FormLabel>密码</FormLabel>
          <FormControl>
            <Input type="password" placeholder="请输入密码" />
          </FormControl>
          <FormMessage>{errors.password}</FormMessage>
        </FormItem>
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交'}
      </Button>
    </Form>
  );
};
```

#### 高级用法
```typescript
import { useForm, zodResolver } from '@yyc3/design-system';

export const AdvancedForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    await createUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormItem>
        <FormLabel>用户名</FormLabel>
        <FormControl>
          <Input {...register('username')} placeholder="请输入用户名" />
        </FormControl>
        <FormMessage>{errors.username?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <FormControl>
          <Input {...register('email')} type="email" placeholder="请输入邮箱" />
        </FormControl>
        <FormMessage>{errors.email?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>密码</FormLabel>
        <FormControl>
          <Input {...register('password')} type="password" placeholder="请输入密码" />
        </FormControl>
        <FormMessage>{errors.password?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交'}
      </Button>
    </form>
  );
};
```

### 验证器组件

#### 实时验证
```typescript
import { useValidator } from '@yyc3/design-system';

export const RealtimeValidation = () => {
  const [value, setValue] = useState('');
  const { error, isValidating } = useValidator(value, {
    rules: [
      { required: true, message: '此字段为必填项' },
      { minLength: 6, message: '至少需要6个字符' },
      { maxLength: 50, message: '最多50个字符' }
    ],
    debounce: 300
  });

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入内容"
        error={error}
      />
      {isValidating && <span>验证中...</span>}
    </div>
  );
};
```

#### 异步验证
```typescript
import { useAsyncValidator } from '@yyc3/design-system';

export const AsyncValidation = () => {
  const [value, setValue] = useState('');
  const { error, isValidating } = useAsyncValidator(value, {
    validator: async (val) => {
      const exists = await checkUsernameExists(val);
      return exists ? '用户名已存在' : null;
    },
    debounce: 500
  });

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入用户名"
        error={error}
      />
      {isValidating && <span>检查用户名是否可用...</span>}
    </div>
  );
};
```

## 输入清理

### 清理函数

#### 字符串清理
```typescript
export function sanitizeString(input: string): string {
  return input
    .trim() // 去除首尾空格
    .replace(/\s+/g, ' ') // 合并多个空格
    .replace(/[<>]/g, '') // 移除潜在 XSS 字符
    .substring(0, 1000); // 限制长度
}
```

#### HTML 清理
```typescript
import DOMPurify from 'dompurify';

export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'title', 'target']
  });
}
```

#### 数字清理
```typescript
export function sanitizeNumber(input: string): number {
  const cleaned = input.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
```

#### URL 清理
```typescript
export function sanitizeURL(input: string): string {
  try {
    const url = new URL(input);
    // 只允许 http 和 https 协议
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }
    return url.toString();
  } catch {
    return '';
  }
}
```

## 安全措施

### XSS 防护

#### 输入过滤
```typescript
import xss from 'xss';

export function filterXSS(input: string): string {
  return xss(input, {
    whiteList: {}, // 禁止所有 HTML 标签
    stripIgnoreTag: true, // 移除不在白名单中的标签
    stripIgnoreTagBody: ['script'] // 移除 script 标签及其内容
  });
}
```

#### 输出转义
```typescript
export function escapeHTML(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return input.replace(/[&<>"']/g, (m) => map[m]);
}
```

### SQL 注入防护

#### 参数化查询
```typescript
import { Pool } from 'pg';

const pool = new Pool({ /* config */ });

export async function createUser(username: string, email: string): Promise<User> {
  const query = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
  const values = [username, email];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}
```

#### ORM 使用
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(username: string, email: string): Promise<User> {
  return prisma.user.create({
    data: {
      username,
      email
    }
  });
}
```

### CSRF 防护

#### Token 生成
```typescript
import crypto from 'crypto';

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}
```

#### Token 验证中间件
```typescript
export const csrfMiddleware = (req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session.csrfToken;

  if (!token || !verifyCSRFToken(token, sessionToken)) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }

  next();
};
```

## 性能优化

### 防抖和节流

#### 防抖验证
```typescript
import { useDebounce } from '@yyc3/design-system';

export const DebouncedValidation = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (debouncedValue) {
      validate(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="请输入内容"
    />
  );
};
```

#### 节流验证
```typescript
import { useThrottle } from '@yyc3/design-system';

export const ThrottledValidation = () => {
  const [value, setValue] = useState('');
  const throttledValidate = useThrottle(validate, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    throttledValidate(e.target.value);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder="请输入内容"
    />
  );
};
```

### 缓存验证结果

```typescript
const validationCache = new Map<string, { result: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

export function cachedValidate(value: string, rules: ValidationRule[]): ValidationResult {
  const cacheKey = JSON.stringify({ value, rules });
  const cached = validationCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const result = validate(value, rules);
  validationCache.set(cacheKey, { result, timestamp: Date.now() });

  return result;
}
```

## 最佳实践

### 1. 验证时机
- 实时验证：提供即时反馈
- 提交验证：确保数据完整性
- 混合验证：平衡用户体验和数据安全

### 2. 错误提示
- 清晰的错误消息
- 具体的错误位置
- 建设性的修复建议
- 多语言支持

### 3. 用户体验
- 友好的错误提示
- 自动聚焦错误字段
- 保留已输入的有效数据
- 提供重置选项

### 4. 安全第一
- 所有输入必须验证
- 清理和过滤用户输入
- 防止常见攻击
- 定期安全审计

### 5. 性能优化
- 使用防抖和节流
- 缓存验证结果
- 异步验证优化
- 避免重复验证

## 参考资源

- [Zod 文档](https://zod.dev/)
- [OWASP 验证指南](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [React Hook Form](https://react-hook-form.com/)
- [YYC³ 标准规范](https://github.com/yyc3/standards)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*文档最后更新：2026-02-18*

</div>

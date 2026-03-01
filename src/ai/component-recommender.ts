/**
 * @file AI 组件推荐器
 * @description 基于用户需求智能推荐合适的组件
 * @module ai/component-recommender
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

export type ComponentType =
  | 'Button'
  | 'Card'
  | 'Input'
  | 'Dropdown'
  | 'Table'
  | 'Modal'
  | 'Tabs'
  | 'Pagination'
  | 'Breadcrumb'
  | 'Alert'
  | 'Tooltip'
  | 'Form'
  | 'Checkbox'
  | 'Radio'
  | 'Switch'
  | 'Badge'
  | 'Spinner'
  | 'Menu'
  | 'Divider'
  | 'DatePicker'
  | 'ColorPicker'
  | 'Slider';

export interface UIRequirement {
  description: string;
  actionType?: 'navigation' | 'input' | 'display' | 'feedback' | 'selection' | 'layout';
  contentType?: 'text' | 'image' | 'data' | 'mixed';
  interactionLevel?: 'low' | 'medium' | 'high';
  complexity?: 'simple' | 'medium' | 'complex';
  accessibilityLevel?: 'basic' | 'standard' | 'advanced';
  responsiveRequired?: boolean;
  themeAdaptation?: boolean;
  animationRequired?: boolean;
}

export interface ComponentRecommendation {
  component: ComponentType;
  confidence: number;
  reason: string;
  alternatives: ComponentType[];
  features: string[];
  complexity: 'simple' | 'medium' | 'complex';
  learningCurve: 'easy' | 'moderate' | 'steep';
  useCases: string[];
  bestPractices: string[];
}

export interface RecommendationOptions {
  requirements: UIRequirement[];
  componentLibrary?: ComponentType[];
  excludeComponents?: ComponentType[];
  minConfidence?: number;
  maxRecommendations?: number;
}

const componentDatabase: Record<
  ComponentType,
  {
    description: string;
    actionTypes: string[];
    contentTypes: string[];
    interactionLevels: string[];
    complexities: string[];
    features: string[];
    learningCurve: 'easy' | 'moderate' | 'steep';
    useCases: string[];
    bestPractices: string[];
  }
> = {
  Button: {
    description: '用于触发操作或导航的可点击按钮',
    actionTypes: ['navigation', 'action', 'submit', 'cancel'],
    contentTypes: ['text', 'icon', 'mixed'],
    interactionLevels: ['medium', 'high'],
    complexities: ['simple'],
    features: ['variant', 'size', 'disabled', 'loading', 'icon'],
    learningCurve: 'easy',
    useCases: ['表单提交', '导航链接', '操作触发', '对话框关闭'],
    bestPractices: [
      '提供清晰的标签文本',
      '使用适当的variant区分主要和次要操作',
      '保持一致性',
      '提供禁用状态反馈',
    ],
  },
  Card: {
    description: '用于组织内容的容器组件',
    actionTypes: ['display', 'layout'],
    contentTypes: ['text', 'image', 'data', 'mixed'],
    interactionLevels: ['low', 'medium'],
    complexities: ['simple', 'medium'],
    features: ['header', 'footer', 'shadow', 'border', 'hover effect'],
    learningCurve: 'easy',
    useCases: ['内容分组', '信息展示', '卡片式布局', '仪表盘'],
    bestPractices: ['保持内容聚焦', '使用一致的间距', '提供清晰的视觉层次', '适当的留白'],
  },
  Input: {
    description: '用于收集用户输入的文本字段',
    actionTypes: ['input'],
    contentTypes: ['text'],
    interactionLevels: ['high'],
    complexities: ['simple', 'medium'],
    features: ['validation', 'placeholder', 'disabled', 'clear button', 'password toggle'],
    learningCurve: 'easy',
    useCases: ['表单输入', '搜索框', '文本编辑', '密码输入'],
    bestPractices: ['提供清晰的label', '使用适当的输入类型', '即时验证反馈', '错误消息清晰可见'],
  },
  Dropdown: {
    description: '从选项列表中选择一个或多个项目',
    actionTypes: ['selection'],
    contentTypes: ['text', 'icon', 'mixed'],
    interactionLevels: ['medium', 'high'],
    complexities: ['medium'],
    features: ['single/multi select', 'search', 'disabled options', 'groups', 'icons'],
    learningCurve: 'easy',
    useCases: ['表单选择', '过滤器', '菜单导航', '设置选项'],
    bestPractices: ['提供默认值', '合理分组选项', '支持键盘导航', '显示当前选择'],
  },
  Table: {
    description: '用于展示结构化数据的表格',
    actionTypes: ['display', 'selection'],
    contentTypes: ['data'],
    interactionLevels: ['medium', 'high'],
    complexities: ['complex'],
    features: ['sorting', 'filtering', 'pagination', 'row selection', 'expandable rows'],
    learningCurve: 'moderate',
    useCases: ['数据列表', '财务报表', '用户管理', '产品目录'],
    bestPractices: ['提供分页', '支持排序和过滤', '清晰的列标题', '响应式设计'],
  },
  Modal: {
    description: '覆盖父内容的对话框组件',
    actionTypes: ['feedback', 'input', 'display'],
    contentTypes: ['text', 'image', 'data', 'mixed'],
    interactionLevels: ['medium', 'high'],
    complexities: ['medium', 'complex'],
    features: ['overlay', 'close button', 'size variants', 'animation', 'focus trap'],
    learningCurve: 'moderate',
    useCases: ['表单填写', '确认对话框', '详细内容展示', '警告提示'],
    bestPractices: ['提供关闭方式', '管理焦点', '避免嵌套', '清晰的行动按钮'],
  },
  Tabs: {
    description: '用于切换不同内容视图的标签页',
    actionTypes: ['navigation', 'display'],
    contentTypes: ['text', 'image', 'data', 'mixed'],
    interactionLevels: ['medium'],
    complexities: ['medium'],
    features: ['scrollable', 'disabled tabs', 'icons', 'badge indicators'],
    learningCurve: 'easy',
    useCases: ['设置页面', '多视图切换', '分类内容', '表单步骤'],
    bestPractices: ['保持标签简短', '显示活动状态', '支持键盘导航', '合理的默认标签'],
  },
  Pagination: {
    description: '用于分页浏览大量内容',
    actionTypes: ['navigation'],
    contentTypes: ['data'],
    interactionLevels: ['medium'],
    complexities: ['simple'],
    features: ['page numbers', 'prev/next', 'jump to page', 'items per page'],
    learningCurve: 'easy',
    useCases: ['表格分页', '文章列表', '搜索结果', '产品列表'],
    bestPractices: ['显示总页数', '提供快速跳转', '保持当前页高亮', '一致的样式'],
  },
  Breadcrumb: {
    description: '显示当前页面在层级结构中的位置',
    actionTypes: ['navigation'],
    contentTypes: ['text'],
    interactionLevels: ['low', 'medium'],
    complexities: ['simple'],
    features: ['clickable', 'separator', 'truncate long paths', 'home link'],
    learningCurve: 'easy',
    useCases: ['导航路径', '文档结构', '分类浏览', '面包屑导航'],
    bestPractices: ['从首页开始', '可点击父级页面', '当前页不可点击', '合理的截断'],
  },
  Alert: {
    description: '用于显示重要信息的提示组件',
    actionTypes: ['feedback', 'display'],
    contentTypes: ['text'],
    interactionLevels: ['low'],
    complexities: ['simple'],
    features: ['severity levels', 'dismissible', 'icons', 'actions'],
    learningCurve: 'easy',
    useCases: ['错误提示', '成功消息', '警告信息', '系统通知'],
    bestPractices: ['使用适当的颜色', '提供关闭选项', '简洁明了', '避免过多同时显示'],
  },
  Tooltip: {
    description: '鼠标悬停时显示的提示信息',
    actionTypes: ['feedback', 'display'],
    contentTypes: ['text', 'icon'],
    interactionLevels: ['low'],
    complexities: ['simple'],
    features: ['positioning', 'delay', 'arrow', 'custom content'],
    learningCurve: 'easy',
    useCases: ['图标说明', '术语解释', '快捷键提示', '补充信息'],
    bestPractices: ['简洁的文字', '合理的延迟', '避免遮挡', '可访问性'],
  },
  Form: {
    description: '用于收集和验证用户输入的表单',
    actionTypes: ['input', 'selection', 'action'],
    contentTypes: ['text', 'data', 'mixed'],
    interactionLevels: ['high'],
    complexities: ['complex'],
    features: ['validation', 'layout', 'submission', 'reset', 'field grouping'],
    learningCurve: 'steep',
    useCases: ['用户注册', '数据编辑', '设置配置', '联系表单'],
    bestPractices: ['清晰的标签', '即时验证', '合理的分组', '成功反馈'],
  },
  Checkbox: {
    description: '用于多选的复选框',
    actionTypes: ['selection'],
    contentTypes: ['text', 'icon'],
    interactionLevels: ['medium'],
    complexities: ['simple'],
    features: ['checked/unchecked', 'indeterminate', 'disabled', 'group behavior'],
    learningCurve: 'easy',
    useCases: ['多选列表', '同意条款', '选项过滤', '权限设置'],
    bestPractices: ['清晰的标签', '合理的默认值', '支持键盘', '一致的间距'],
  },
  Radio: {
    description: '用于单选的单选按钮',
    actionTypes: ['selection'],
    contentTypes: ['text', 'icon'],
    interactionLevels: ['medium'],
    complexities: ['simple'],
    features: ['selected/unselected', 'disabled', 'group behavior', 'labels'],
    learningCurve: 'easy',
    useCases: ['单选列表', '性别选择', '支付方式', '主题切换'],
    bestPractices: ['清晰的标签', '合理的默认值', '垂直或水平对齐', '足够的点击区域'],
  },
  Switch: {
    description: '用于开关状态的切换开关',
    actionTypes: ['selection', 'action'],
    contentTypes: ['text'],
    interactionLevels: ['medium'],
    complexities: ['simple'],
    features: ['on/off', 'disabled', 'size variants', 'labels'],
    learningCurve: 'easy',
    useCases: ['设置开关', '功能启用', '暗色模式', '通知设置'],
    bestPractices: ['清晰的状态指示', '提供标签', '即时的视觉反馈', '合理的尺寸'],
  },
  Badge: {
    description: '用于显示状态或计数的徽章',
    actionTypes: ['display', 'feedback'],
    contentTypes: ['text', 'icon'],
    interactionLevels: ['low'],
    complexities: ['simple'],
    features: ['variants', 'count', 'dot indicator', 'positioning'],
    learningCurve: 'easy',
    useCases: ['状态标记', '未读计数', '通知数量', '标签'],
    bestPractices: ['使用适当的颜色', '清晰可读', '合理的定位', '避免过度使用'],
  },
  Spinner: {
    description: '用于加载状态的加载指示器',
    actionTypes: ['feedback', 'display'],
    contentTypes: ['icon'],
    interactionLevels: ['low'],
    complexities: ['simple'],
    features: ['size variants', 'colors', 'speed control', 'custom styles'],
    learningCurve: 'easy',
    useCases: ['异步操作', '页面加载', '数据获取', '内容刷新'],
    bestPractices: ['清晰的加载状态', '合理的尺寸', '适当的速度', '提供上下文'],
  },
  Menu: {
    description: '用于导航和操作的下拉菜单',
    actionTypes: ['navigation', 'selection', 'action'],
    contentTypes: ['text', 'icon', 'mixed'],
    interactionLevels: ['medium', 'high'],
    complexities: ['medium'],
    features: ['groups', 'icons', 'keyboard nav', 'submenu', 'disabled items'],
    learningCurve: 'easy',
    useCases: ['应用菜单', '操作菜单', '设置菜单', '导航链接'],
    bestPractices: ['逻辑分组', '快捷键提示', '清晰的标签', '合理的层级'],
  },
  Divider: {
    description: '用于分隔内容的分隔线',
    actionTypes: ['display', 'layout'],
    contentTypes: ['text', 'empty'],
    interactionLevels: ['low'],
    complexities: ['simple'],
    features: ['horizontal/vertical', 'text label', 'dashed', 'spacing'],
    learningCurve: 'easy',
    useCases: ['内容分组', '视觉分隔', '章节划分', '布局辅助'],
    bestPractices: ['一致的间距', '适当地使用文本标签', '合理的颜色', '避免过度使用'],
  },
  DatePicker: {
    description: '用于选择日期的日期选择器',
    actionTypes: ['input', 'selection'],
    contentTypes: ['text', 'data'],
    interactionLevels: ['high'],
    complexities: ['complex'],
    features: ['calendar view', 'range selection', 'disable dates', 'time picker', 'localization'],
    learningCurve: 'moderate',
    useCases: ['日期输入', '日期范围', '预约安排', '时间规划'],
    bestPractices: ['支持键盘', '清晰的今日指示', '合理的日期格式', '禁用日期提示'],
  },
  ColorPicker: {
    description: '用于选择颜色的颜色选择器',
    actionTypes: ['input', 'selection'],
    contentTypes: ['color'],
    interactionLevels: ['high'],
    complexities: ['medium'],
    features: ['presets', 'hex/rgb input', 'eyedropper', 'alpha channel', 'recent colors'],
    learningCurve: 'moderate',
    useCases: ['主题定制', '品牌颜色', '样式编辑', '颜色配置'],
    bestPractices: ['提供常用颜色预设', '支持多种格式', '实时预览', '清晰的选中状态'],
  },
  Slider: {
    description: '用于选择数值范围的滑块',
    actionTypes: ['input', 'selection'],
    contentTypes: ['number'],
    interactionLevels: ['medium', 'high'],
    complexities: ['simple'],
    features: ['range', 'step', 'marks', 'labels', 'dual handles'],
    learningCurve: 'easy',
    useCases: ['音量调节', '价格范围', '亮度控制', '数值筛选'],
    bestPractices: ['显示当前值', '合理的步长', '适当的范围', '清晰的标签'],
  },
};

const calculateMatchScore = (component: ComponentType, requirements: UIRequirement[]): number => {
  const componentInfo = componentDatabase[component];
  if (!componentInfo) return 0;

  let score = 0;
  let maxScore = 0;

  requirements.forEach((req) => {
    maxScore += 10;

    if (req.actionType && componentInfo.actionTypes.includes(req.actionType)) {
      score += 4;
    }

    if (req.contentType && componentInfo.contentTypes.includes(req.contentType)) {
      score += 3;
    }

    if (req.interactionLevel) {
      if (req.interactionLevel === 'low' && componentInfo.interactionLevels.includes('low')) {
        score += 2;
      } else if (
        req.interactionLevel === 'medium' &&
        componentInfo.interactionLevels.includes('medium')
      ) {
        score += 2;
      } else if (
        req.interactionLevel === 'high' &&
        componentInfo.interactionLevels.includes('high')
      ) {
        score += 2;
      }
    }

    if (req.complexity) {
      if (req.complexity === 'simple' && componentInfo.complexities.includes('simple')) {
        score += 1;
      } else if (req.complexity === 'medium' && componentInfo.complexities.includes('medium')) {
        score += 1;
      } else if (req.complexity === 'complex' && componentInfo.complexities.includes('complex')) {
        score += 1;
      }
    }
  });

  return maxScore > 0 ? (score / maxScore) * 100 : 0;
};

export class ComponentRecommender {
  private components: ComponentType[];

  constructor(options?: { componentLibrary?: ComponentType[] }) {
    this.components =
      options?.componentLibrary || (Object.keys(componentDatabase) as ComponentType[]);
  }

  generateRecommendations(options: RecommendationOptions): ComponentRecommendation[] {
    const {
      requirements,
      componentLibrary,
      excludeComponents = [],
      minConfidence = 50,
      maxRecommendations = 5,
    } = options;

    const availableComponents = componentLibrary || this.components;
    const filteredComponents = availableComponents.filter(
      (comp) => !excludeComponents.includes(comp)
    );

    const recommendations = filteredComponents
      .map((component) => {
        const confidence = calculateMatchScore(component, requirements);
        const componentInfo = componentDatabase[component];

        return {
          component,
          confidence,
          reason: this.generateReason(component, requirements, confidence),
          alternatives: this.findAlternatives(component, requirements),
          features: componentInfo.features,
          complexity: this.categorizeComplexity(component),
          learningCurve: componentInfo.learningCurve,
          useCases: componentInfo.useCases,
          bestPractices: componentInfo.bestPractices,
        };
      })
      .filter((rec) => rec.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxRecommendations);

    return recommendations;
  }

  private generateReason(
    component: ComponentType,
    requirements: UIRequirement[],
    confidence: number
  ): string {
    const componentInfo = componentDatabase[component];
    const matchedActions = requirements
      .filter((req) => req.actionType && componentInfo.actionTypes.includes(req.actionType))
      .map((req) => req.actionType)
      .join('、');
    const matchedContent = requirements
      .filter((req) => req.contentType && componentInfo.contentTypes.includes(req.contentType))
      .map((req) => req.contentType)
      .join('、');

    const reasons: string[] = [];
    if (matchedActions) {
      reasons.push(`适合${matchedActions}操作`);
    }
    if (matchedContent) {
      reasons.push(`支持${matchedContent}内容类型`);
    }
    if (confidence >= 80) {
      reasons.push('高度匹配您的需求');
    } else if (confidence >= 60) {
      reasons.push('较好地匹配您的需求');
    }

    return reasons.join('，');
  }

  private findAlternatives(
    component: ComponentType,
    _requirements: UIRequirement[]
  ): ComponentType[] {
    const availableComponents = Object.keys(componentDatabase) as ComponentType[];

    return availableComponents
      .filter((comp) => comp !== component)
      .map((comp) => ({
        component: comp,
        score: this.calculateSimilarity(component, comp),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.component);
  }

  private calculateSimilarity(comp1: ComponentType, comp2: ComponentType): number {
    const info1 = componentDatabase[comp1];
    const info2 = componentDatabase[comp2];

    const actionOverlap = info1.actionTypes.filter((a) => info2.actionTypes.includes(a)).length;
    const contentOverlap = info1.contentTypes.filter((c) => info2.contentTypes.includes(c)).length;

    return (actionOverlap + contentOverlap) / 2;
  }

  private categorizeComplexity(component: ComponentType): 'simple' | 'medium' | 'complex' {
    const info = componentDatabase[component];
    if (info.complexities.includes('complex')) return 'complex';
    if (info.complexities.includes('medium')) return 'medium';
    return 'simple';
  }

  getComponentDetails(component: ComponentType): (typeof componentDatabase)[ComponentType] | null {
    return componentDatabase[component] || null;
  }

  getAllComponents(): ComponentType[] {
    return Object.keys(componentDatabase) as ComponentType[];
  }
}

export const componentRecommender = new ComponentRecommender();

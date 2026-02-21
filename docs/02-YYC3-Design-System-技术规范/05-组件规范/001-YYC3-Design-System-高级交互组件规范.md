/**
 * @file 高级交互组件规范
 * @description YYC³ 设计系统高级交互组件规范，包括 Table、Tree、Pagination 等
 * @module docs/advanced-components
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# YYC³ 设计系统高级交互组件规范

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

本规范基于 YYC³ 团队「五高五标五化」核心要求，为设计系统高级交互组件提供统一标准，确保组件功能完整、性能优异、可访问性强。

## 核心原则

### 五高原则

#### 高可用
- 提供加载状态和空状态
- 支持错误处理和重试
- 实现优雅降级
- 支持离线模式

#### 高性能
- 虚拟滚动优化
- 懒加载和按需渲染
- 防抖和节流优化
- 缓存策略

#### 高安全
- 输入验证和清理
- XSS 防护
- CSRF 保护
- 权限控制

#### 高扩展
- 插件化架构
- 自定义渲染器
- 事件钩子系统
- 主题定制

#### 高可维护
- 清晰的组件 API
- 完整的类型定义
- 详细的文档和示例
- 标准化的错误处理

## Table 组件

### 基础用法

```typescript
import { Table } from '@yyc3/design-system';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const columns = [
  {
    key: 'id',
    title: 'ID',
    width: 80
  },
  {
    key: 'name',
    title: '姓名',
    width: 200
  },
  {
    key: 'email',
    title: '邮箱',
    width: 250
  },
  {
    key: 'role',
    title: '角色',
    width: 150
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (status: string) => (
      <Badge variant={status === 'active' ? 'success' : 'default'}>
        {status === 'active' ? '活跃' : '非活跃'}
      </Badge>
    )
  }
];

export const UserTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      setData(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      pagination={{
        total: data.length,
        pageSize: 10,
        current: 1,
        onChange: (page) => console.log('Page changed:', page)
      }}
    />
  );
};
```

### 高级功能

#### 排序
```typescript
const columns = [
  {
    key: 'name',
    title: '姓名',
    width: 200,
    sortable: true,
    sorter: (a: User, b: User) => a.name.localeCompare(b.name)
  },
  {
    key: 'createdAt',
    title: '创建时间',
    width: 200,
    sortable: true,
    sorter: (a: User, b: User) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  }
];
```

#### 过滤
```typescript
const columns = [
  {
    key: 'role',
    title: '角色',
    width: 150,
    filterable: true,
    filters: [
      { text: '管理员', value: 'admin' },
      { text: '用户', value: 'user' },
      { text: '访客', value: 'guest' }
    ],
    onFilter: (value: string, record: User) => record.role === value
  }
];
```

#### 选择
```typescript
export const SelectableTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: number[]) => {
      setSelectedRowKeys(keys);
    },
    getCheckboxProps: (record: User) => ({
      disabled: record.status === 'inactive'
    })
  };

  return (
    <Table
      columns={columns}
      data={data}
      rowSelection={rowSelection}
      rowKey="id"
    />
  );
};
```

#### 展开行
```typescript
const expandedRowRender = (record: User) => (
  <div style={{ padding: '16px' }}>
    <p><strong>详细信息：</strong></p>
    <p>邮箱：{record.email}</p>
    <p>角色：{record.role}</p>
    <p>状态：{record.status}</p>
  </div>
);

export const ExpandableTable = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  return (
    <Table
      columns={columns}
      data={data}
      expandedRowRender={expandedRowRender}
      expandedRowKeys={expandedRowKeys}
      onExpandedRowsChange={(keys) => setExpandedRowKeys(keys)}
      rowKey="id"
    />
  );
};
```

### 虚拟滚动

```typescript
export const VirtualTable = () => {
  return (
    <Table
      columns={columns}
      data={largeData}
      virtual
      scroll={{ y: 500 }}
      rowKey="id"
    />
  );
};
```

## Tree 组件

### 基础用法

```typescript
import { Tree } from '@yyc3/design-system';

interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    key: '1',
    title: '父节点 1',
    children: [
      {
        key: '1-1',
        title: '子节点 1-1'
      },
      {
        key: '1-2',
        title: '子节点 1-2'
      }
    ]
  },
  {
    key: '2',
    title: '父节点 2',
    children: [
      {
        key: '2-1',
        title: '子节点 2-1'
      }
    ]
  }
];

export const BasicTree = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1']);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys);
  };

  const handleSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  return (
    <Tree
      treeData={treeData}
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      onExpand={handleExpand}
      onSelect={handleSelect}
    />
  );
};
```

### 高级功能

#### 可勾选
```typescript
export const CheckableTree = () => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const handleCheck = (keys: string[]) => {
    setCheckedKeys(keys);
  };

  return (
    <Tree
      treeData={treeData}
      checkable
      checkedKeys={checkedKeys}
      onCheck={handleCheck}
    />
  );
};
```

#### 可拖拽
```typescript
export const DraggableTree = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);

  const handleDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: TreeNode[], key: string, callback: (node: TreeNode, i: number, arr: TreeNode[]) => void) => {
      data.forEach((item, i, arr) => {
        if (item.key === key) {
          callback(item, i, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };

    const data = [...treeData];
    let dragObj: TreeNode;

    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      info.node.props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: TreeNode[] = [];
      let i: number;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);
  };

  return (
    <Tree
      treeData={treeData}
      draggable
      onDrop={handleDrop}
    />
  );
};
```

#### 异步加载
```typescript
export const AsyncTree = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);

  const handleLoadData = async ({ key, children }: any) => {
    return new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return;
      }

      setTimeout(() => {
        setTreeData((origin) => {
          return updateTreeData(origin, key, {
            children: [
              { key: `${key}-1`, title: '子节点 1' },
              { key: `${key}-2`, title: '子节点 2' }
            ]
          });
        });
        resolve();
      }, 1000);
    });
  };

  return (
    <Tree
      treeData={treeData}
      loadData={handleLoadData}
    />
  );
};
```

## Pagination 组件

### 基础用法

```typescript
import { Pagination } from '@yyc3/design-system';

export const BasicPagination = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={100}
      onChange={handleChange}
    />
  );
};
```

### 高级功能

#### 快速跳转
```typescript
export const JumpPagination = () => {
  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={1000}
      showQuickJumper
      showSizeChanger
      onChange={handleChange}
    />
  );
};
```

#### 简化模式
```typescript
export const SimplePagination = () => {
  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={100}
      simple
      onChange={handleChange}
    />
  );
};
```

## Breadcrumb 组件

### 基础用法

```typescript
import { Breadcrumb } from '@yyc3/design-system';

export const BasicBreadcrumb = () => {
  const items = [
    { title: '首页', href: '/' },
    { title: '用户管理', href: '/users' },
    { title: '用户列表' }
  ];

  return <Breadcrumb items={items} />;
};
```

### 自定义分隔符

```typescript
export const CustomBreadcrumb = () => {
  return (
    <Breadcrumb
      items={items}
      separator=">"
    />
  );
};
```

## 最佳实践

### 1. 性能优化
- 使用虚拟滚动处理大数据
- 实现懒加载和按需渲染
- 使用防抖和节流优化事件
- 缓存计算结果

### 2. 可访问性
- 提供键盘导航支持
- 添加 ARIA 属性
- 支持屏幕阅读器
- 确保颜色对比度符合标准

### 3. 用户体验
- 提供加载状态和空状态
- 实现平滑的动画效果
- 支持响应式布局
- 提供清晰的错误提示

### 4. 安全性
- 验证所有输入数据
- 清理和过滤用户输入
- 防止 XSS 攻击
- 实现权限控制

### 5. 可维护性
- 清晰的组件 API
- 完整的类型定义
- 详细的文档和示例
- 标准化的错误处理

## 参考资源

- [React Table](https://react-table.tanstack.com/)
- [Ant Design Table](https://ant.design/components/table/)
- [Material UI Table](https://mui.com/components/tables/)
- [YYC³ 标准规范](https://github.com/yyc3/standards)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*文档最后更新：2026-02-18*

</div>

# YYC³ Design System Docker部署指南

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**创建日期**: 2026-02-23
**版本**: 1.0.0
**作者**: YYC³ Team

---

## 概述

本文档提供YYC³ Design System的Docker部署指南，包括开发环境、生产环境和CI/CD集成。

---

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少2GB可用内存
- 至少10GB可用磁盘空间

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/YYC-Cube/YYC3-Design-System.git
cd YYC3-Design-System
```

### 2. 构建镜像

```bash
docker-compose build
```

### 3. 启动服务

```bash
docker-compose up -d
```

### 4. 访问应用

- 主应用: http://localhost:3200
- Storybook: http://localhost:6006 (开发环境)

---

## 开发环境

### 启动开发环境

```bash
docker-compose --profile dev up -d
```

### 查看日志

```bash
docker-compose logs -f yyc3-design-system-dev
```

### 停止开发环境

```bash
docker-compose --profile dev down
```

### 进入容器

```bash
docker-compose exec yyc3-design-system-dev sh
```

---

## 生产环境

### 启动生产环境

```bash
docker-compose --profile production up -d
```

### 配置SSL证书

1. 创建SSL目录：
```bash
mkdir -p ssl
```

2. 将证书文件复制到ssl目录：
```bash
cp /path/to/cert.pem ssl/
cp /path/to/key.pem ssl/
```

3. 重启Nginx：
```bash
docker-compose restart nginx
```

### 查看日志

```bash
docker-compose logs -f yyc3-design-system
docker-compose logs -f nginx
```

### 停止生产环境

```bash
docker-compose --profile production down
```

---

## Docker命令参考

### 构建镜像

```bash
# 构建所有服务
docker-compose build

# 构建特定服务
docker-compose build yyc3-design-system

# 重新构建（不使用缓存）
docker-compose build --no-cache
```

### 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 启动特定服务
docker-compose up -d yyc3-design-system

# 启动并查看日志
docker-compose up
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除卷
docker-compose down -v

# 停止并删除镜像
docker-compose down --rmi all
```

### 查看状态

```bash
# 查看服务状态
docker-compose ps

# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f [service-name]
```

### 进入容器

```bash
# 进入运行中的容器
docker-compose exec [service-name] sh

# 以root用户进入
docker-compose exec -u root [service-name] sh
```

---

## 环境变量

### 应用环境变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| NODE_ENV | production | 运行环境（development/production） |
| PORT | 3200 | 应用端口 |
| LOG_LEVEL | info | 日志级别（debug/info/warn/error） |

### Docker Compose环境变量

创建`.env`文件：

```env
NODE_ENV=production
PORT=3200
LOG_LEVEL=info
```

---

## 数据持久化

### 日志持久化

日志文件存储在`./logs`目录：

```bash
# 查看日志目录
ls -la logs/

# 清理旧日志
find logs/ -name "*.log" -mtime +7 -delete
```

### 数据卷管理

```bash
# 查看所有卷
docker volume ls

# 删除未使用的卷
docker volume prune
```

---

## 性能优化

### 1. 镜像优化

- 使用多阶段构建减小镜像大小
- 使用.alpine基础镜像
- 清理不必要的文件和依赖

### 2. 运行时优化

- 限制容器资源使用
- 配置健康检查
- 使用Nginx反向代理

### 3. 网络优化

- 使用自定义网络
- 配置DNS解析
- 优化连接池

---

## 监控和日志

### 健康检查

```bash
# 检查服务健康状态
docker-compose ps

# 查看健康检查日志
docker inspect yyc3-design-system | grep -A 10 Health
```

### 日志管理

```bash
# 查看实时日志
docker-compose logs -f

# 查看最近100行日志
docker-compose logs --tail=100

# 查看特定时间段的日志
docker-compose logs --since 2024-01-01T00:00:00
```

---

## 故障排除

### 常见问题

#### 1. 端口冲突

```bash
# 检查端口占用
lsof -i :3200

# 修改docker-compose.yml中的端口映射
ports:
  - "3201:3200"
```

#### 2. 内存不足

```bash
# 限制容器内存使用
services:
  yyc3-design-system:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

#### 3. 网络连接问题

```bash
# 检查网络状态
docker network inspect yyc3_yyc3-network

# 重启网络
docker-compose down
docker-compose up -d
```

#### 4. 权限问题

```bash
# 修复文件权限
sudo chown -R $USER:$USER .

# 使用正确的用户运行容器
user: "1000:1000"
```

---

## CI/CD集成

### GitHub Actions示例

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Login to DockerHub
      uses: docker/login-action@v1
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push
      uses: docker/build-push-action@v2
      with:
        context: .
        push: true
        tags: yyc3/design-system:latest
        cache-from: type=registry,ref=yyc3/design-system:latest
        cache-to: type=inline
```

---

## 安全建议

### 1. 镜像安全

- 使用官方基础镜像
- 定期更新基础镜像
- 扫描镜像漏洞

```bash
# 扫描镜像漏洞
docker scan yyc3/design-system:latest
```

### 2. 运行时安全

- 使用非root用户运行容器
- 限制容器权限
- 使用只读文件系统

```yaml
services:
  yyc3-design-system:
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
```

### 3. 网络安全

- 使用私有网络
- 限制端口暴露
- 配置防火墙规则

---

## 备份和恢复

### 备份

```bash
# 备份日志
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/

# 备份配置
tar -czf config-backup-$(date +%Y%m%d).tar.gz nginx.conf .env
```

### 恢复

```bash
# 恢复日志
tar -xzf logs-backup-20240101.tar.gz

# 恢复配置
tar -xzf config-backup-20240101.tar.gz
```

---

## 更新和维护

### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新构建镜像
docker-compose build --no-cache

# 重启服务
docker-compose up -d
```

### 清理资源

```bash
# 清理停止的容器
docker container prune

# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune

# 清理未使用的网络
docker network prune

# 清理所有未使用的资源
docker system prune -a --volumes
```

---

## 参考资源

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [YYC³ Design System文档](https://yyc3.dev/docs)

---

## 支持

如有问题，请联系：

- 邮箱：support@yyc3.dev
- 论坛：https://yyc3.dev/community
- GitHub Issues：https://github.com/YYC-Cube/YYC3-Design-System/issues

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>

/**
 * @file 日志工具测试
 * @description 测试 logger 模块的各项功能
 * @module __tests__/utils/logger.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import { logger } from './logger';

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('debug', () => {
    it('应该在development环境下输出debug日志', () => {
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.debug('Debug message', { data: 'test' });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Debug message', { data: 'test' });
      consoleWarnSpy.mockRestore();
    });

    it('应该在production环境下不输出debug日志', () => {
      process.env.NODE_ENV = 'production';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.debug('Debug message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('应该支持多个参数', () => {
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.debug('Debug message', 'arg1', 'arg2', { key: 'value' });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Debug message', 'arg1', 'arg2', { key: 'value' });
      consoleWarnSpy.mockRestore();
    });
  });

  describe('info', () => {
    it('应该在development环境下输出info日志', () => {
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.info('Info message', { data: 'test' });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Info message', { data: 'test' });
      consoleWarnSpy.mockRestore();
    });

    it('应该在production环境下不输出info日志', () => {
      process.env.NODE_ENV = 'production';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.info('Info message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('应该支持多个参数', () => {
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.info('Info message', 'arg1', 'arg2');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Info message', 'arg1', 'arg2');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('应该在development环境下输出warn日志', () => {
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('Warning message', { data: 'test' });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message', { data: 'test' });
      consoleWarnSpy.mockRestore();
    });

    it('应该在production环境下不输出warn日志', () => {
      process.env.NODE_ENV = 'production';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('Warning message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('应该支持多个参数', () => {
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('Warning message', 'arg1', 'arg2');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message', 'arg1', 'arg2');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('应该在development环境下输出error日志', () => {
      process.env.NODE_ENV = 'development';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('Error message', { data: 'test' });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error message', { data: 'test' });
      consoleErrorSpy.mockRestore();
    });

    it('应该在production环境下不输出error日志', () => {
      process.env.NODE_ENV = 'production';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('Error message');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('应该支持多个参数', () => {
      process.env.NODE_ENV = 'development';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('Error message', 'arg1', 'arg2', { key: 'value' });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error message', 'arg1', 'arg2', { key: 'value' });
      consoleErrorSpy.mockRestore();
    });

    it('应该支持错误对象作为参数', () => {
      process.env.NODE_ENV = 'development';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred', error);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('环境变量处理', () => {
    it('应该在undefined NODE_ENV时视为production', () => {
      delete process.env.NODE_ENV;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.debug('Debug message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('应该在test环境下不输出日志', () => {
      process.env.NODE_ENV = 'test';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.debug('Debug message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('应该在staging环境下不输出日志', () => {
      process.env.NODE_ENV = 'staging';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.debug('Debug message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
});

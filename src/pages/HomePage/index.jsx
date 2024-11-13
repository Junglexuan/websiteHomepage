import './index.css';
import { useEffect, useState, useRef } from 'react';
import { Button, Select, Dropdown, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { items, } from './utils';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import ParticleEffect from './component/Particle';

gsap.registerPlugin(useGSAP);

const HomePage = () => {
  const [showService, setShowService] = useState(false)
  const [hasScrolledOneScreen, setHasScrolledOneScreen] = useState(false);
  const quicklyContent = useRef(); //一屏外部整个内容
  const fixedElementRef = useRef(); //需要滚动固定的顶部导航
  const robotImg = useRef(null); // 引用图片元素
  const appsCenter = useRef();
  // const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fixedElement = fixedElementRef.current; //获取页面和固定元素
    const pageHeight = document.documentElement.scrollHeight; //获取面板的高度
    //监听滚动事件
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = pageHeight - window.innerHeight; //最大滚动距离
      const screenHeight = window.innerHeight; //获取当前的滚动位置和视口高度，根据滚动位置判断是否为一屏滚动完位置
      // 计算固定元素的Y坐标（在视口内滚动）定位
      const elementPosition = scrollPosition < maxScroll ? scrollPosition : maxScroll;
      gsap.to(fixedElement, { //固定导航栏的位置 
        y: elementPosition,
        duration: 0, //动画时长
        ease: 'power1.out', //缓动效果
        zIndex: 100,
      });

      if (scrollPosition + 200 >= screenHeight) { //判断是否已经滚动超过一屏
        setHasScrolledOneScreen(true);
      } else {
        setHasScrolledOneScreen(false);
      }
    };
    const cardHandleScroll = () => {
      // 获取第二屏的高度
      const secondScreen = document.getElementById('secondScreen');
      const secondScreenHeight = secondScreen.offsetHeight;
      // 获取第二屏相对于视口的顶部位置
      const secondScreenTop = secondScreen.getBoundingClientRect().top;
      // 计算滚动进度
      const progress = Math.min(1, Math.max(0, (window.scrollY - secondScreenTop) / secondScreenHeight));
      // setScrollProgress(progress);
      // 使用 GSAP 控制元素的旋转
      gsap.to(robotImg.current, {
        rotationX: 20 - progress * 20,  // 控制 X 轴的旋转
        opacity: 0.8 + progress * 0.2,
        ease: 'none',  // 设置线性过渡
        duration: 0.1, // 动画时长
        willChange: 'transform,opacity'
      });
    }
    window.addEventListener('scroll', handleScroll); //添加滚动事件监听
    window.addEventListener('scroll', cardHandleScroll); //添加滚动事件监听
    return () => { //清理滚动事件监听
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', cardHandleScroll);
    };
  }, []);

  useEffect(() => {
    if (fixedElementRef.current) {
      if (hasScrolledOneScreen) {
        gsap.to(fixedElementRef.current, { width: '420px', duration: 1 }); //使用GSAP动画改变元素的宽度
      } else {
        gsap.to(fixedElementRef.current, { width: '558px', duration: 1 }); //恢复原来的宽度
      }
    }
  }, [hasScrolledOneScreen]);

  useGSAP(() => {
    // const boxes = gsap.utils.toArray('.box');
    // boxes.forEach((box) => {
    // gsap.to('.quicklyTop', {
    //   y: -40,
    //   scrollTrigger: {
    //     trigger: '.quicklyTop',
    //     start: 'bottom bottom',
    //     end: 'top 20%',
    //     scrub: true,
    //     // markers: true,
    //   },
    // });
    // });

    // const boxes = gsap.utils.toArray('.box');
    // console.log('boxes: ', boxes);
    gsap.to('.quicklyTop', { y: -40, })
    gsap.to('.quicklyBtn', { y: -40, })
    gsap.timeline()
      .to('.quicklyCharacter', { y: -20, opacity: 1, scale: 1 })
      .to('.quicklyRocket', {
        rotateZ: 2,
        repeat: -1,
        yoyo: true,
        duration: 0.2,
        ease: 'power1.inOut',
        willChange: 'rotate',
      })
      .to('.quicklyRocket', {
        y: '-30%', //向上移动
        repeat: -1, //无限循环
        yoyo: true, //向上移动后再向下返回
        duration: 3, //4s完成一个返回
        ease: 'power1.inOut', //使用缓动函数
        willChange: 'transform',
      })
  }, { dependencies: [], scope: quicklyContent, revertOnUpdate: false });

  const setServiceHandle = () => {
    setShowService(!showService)
  }
  const robotImgRightMouseEnter = () => {
    // 当鼠标悬停时，触发动画
    gsap.to('.robotImgRight', {
      y: -10,
      scale: 1.03, //放大 1.03 倍
      rotateY: 4,
      ease: "power2.out", //缓动效果
      willChange: 'transform',
    });
  };

  const robotImgRightMouseLeave = () => {
    // 当鼠标离开时，恢复到原来的状态
    gsap.to('.robotImgRight', {
      y: 0,
      scale: 1, //恢复原始大小
      rotateY: 0,
      ease: "power2.out", //缓动效果
    });
  };
  return (
    <div className='homepage'>
      <div className='homepage_quickly'>
        <div className='homepage_quickly_center' ref={quicklyContent}>
          <div className={classnames('homepage_quickly_top', 'homepage_quickly_topmin', 'quicklyTop')} ref={fixedElementRef}>
            <div className='homepage_quickly_topleft'></div>
            <div className='homepage_quickly_right'>
              <span className='homepage_quickly_right_navi'>产品</span>
              <span className='homepage_quickly_right_navi'>最新动态</span>
              <Select
                className='homepage_quickly_right_select'
                defaultValue="chinese"
                options={[
                  { value: 'chinese', label: '中文' },
                  { value: 'ENGLISH', label: 'ENGLISH' },
                ]}
              />
            </div>
            <div className='homepage_quickly_rightmin'>
              <Select
                className='homepage_quickly_right_select'
                defaultValue="chinese"
                options={[
                  { value: 'chinese', label: '中文' },
                  { value: 'ENGLISH', label: 'ENGLISH' },
                ]}
              />
              <Dropdown menu={{ items }} trigger={['click']} rootClassName='homepage_quickly_rightmin_trop'>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <MenuOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
          <div className={classnames('homepage_quickly_center_copywrite', 'quicklyCharacter')}>
            <span className='homepage_quickly_center_copywrite_spanai'>快速构建AI<span className='homepage_quickly_center_copywrite_agent'>智能体</span></span>
            <span className='homepage_quickly_center_copywrite_spandes'>由AI驱动的智能应用、数据BI分析、超自动化业务</span>
            <div className={classnames('homepage_quickly_center_copywrite_rocket', 'quicklyRocket')}></div>
          </div>
          <div className={classnames('homepage_quickly_bottom', 'quicklyBtn')}>
            <Button type='primary' className='homepage_quickly_bottom_use'>
              <span>立即使用</span>
              <span className='homepage_quickly_bottom_usewait'>待上线</span>
            </Button>
            <Button className={classnames('homepage_quickly_bottom_apps', 'my-element')}>应用市场</Button>
            <Button className='homepage_quickly_bottom_advice' onClick={setServiceHandle}>
              <span>我要咨询</span>
              {
                showService ?
                  <div className='homepage_quickly_bottom_advice-img'></div> : null
              }
            </Button>
          </div>
        </div>
      </div>
      <div id="secondScreen" className='homepage_apps' style={{ position: 'relative' }}>
        <ParticleEffect />
        <div className='homepage_apps_center' ref={appsCenter}>
          <div className='homepage_apps_top'>
            <span className='homepage_apps_top_ai'>创造属于你的AI应用</span>
            <span className='homepage_apps_top_easy'>一站式AI智能体搭建，轻松玩转和运营AIGC激发无限潜能</span>
          </div>
          <div className="homepage_apps_top_robotimg" ref={robotImg}>
            <div className="homepage_apps_top_robotimg_left">
              <span className="homepage_apps_top_robotimg_left_span">特定领域的</span>
              <span className="homepage_apps_top_robotimg_left_title">智能对话机器人</span>
              <span className="homepage_apps_top_robotimg_left_des">通过可视化的提示词编排和数据集嵌入，零代码即可快速构建对话机器人或AI助理，并可持续优化对话策略，革新人机交互体验</span>
            </div>
            <div className={classnames('homepage_apps_top_robotimg_right', 'robotImgRight')} onMouseEnter={robotImgRightMouseEnter}
              onMouseLeave={robotImgRightMouseLeave}></div>
          </div>
        </div>
      </div>
      <div className='homepage_agent'>
        <ParticleEffect style={{ position: 'absolute', top: 0, left: 0 }} />
        <div className='homepage_agent_center'>
          <div className="homepage_agent_agentimg">
            <div className="homepage_agent_agentimg_left"></div>
            <div className="homepage_agent_agentimg_right">
              <div className="homepage_agent_agentimg_right_span">低代码构建的</div>
              <div className="homepage_agent_agentimg_right_title">智能体 Agent</div>
              <div className="homepage_agent_agentimg_right_des">通过整合提示词、业务数据集与插件工具，并借助可视化和低代码的流程编排，构建面向特定业务场景的半自主智能体，从而释放个人和企业的生产力</div>
            </div>
          </div>
        </div>
      </div>
      <div className="homepage_agentrobot">
        <div className="homepage_agentrobot_center">
          <div className="homepage_agentrobot_agentrobotimg">
            <div className="homepage_agentrobot_agent"></div>
            <div className="homepage_agentrobot_robot">
              <div className="homepage_agentrobot_robot_top">
                <div className="homepage_agentrobot_robot_top_title">智能设备/机器人交互</div>
                <div className="homepage_agentrobot_robot_top_des">基于大模型的深度学习和自然语言处理能力，实现智能穿戴设备对话式交互。语义感知AI交互体验，成为用户<span>真正的智能伴侣</span></div>
              </div>
              <div className="homepage_agentrobot_robot_bottom"></div>
            </div>
          </div>
        </div>
      </div>
      <div className='homepage_core'>
        <div className='homepage_core_center'>
          <div className='homepage_core_title'>核心产品</div>
          <div className='homepage_core_content'>
            <div className='homepage_core_top'>
              <div className='homepage_core_top_left'>
                <span className='homepage_core_top_left_title'>海狸超级应用工厂</span>
                <span className='homepage_core_top_left_des'>AI大模型+数字化底座，提供一站式应用构建、数据BI、超自动化和智能体能力</span>
                <Button type='primary' className='homepage_core_top_left_btn'>了解详情</Button>
                <div className='homepage_core_top_left_img'></div>
              </div>
              <div className='homepage_core_top_right'>
                <span className='homepage_core_top_right_title'>智慧经营分析大脑</span>
                <span className='homepage_core_top_right_des'>AI大模型结合数据分析引擎，打造“可视、可控、可动”的智慧经营分析平台</span>
                <Button type='primary' className='homepage_core_top_right_btn'>了解详情</Button>
                <div className='homepage_core_top_right_img'></div>
              </div>
            </div>
            <div className='homepage_core_bottom'>
              <div className='homepage_core_left'>
                <span className='homepage_core_left_title'>超自动化助手</span>
                <span className='homepage_core_left_des'>AI大模型驱动，一句话帮您自动完成 流程任务</span>
                <Button type='primary' className='homepage_core_left_btn'>了解详情</Button>
              </div>
              <div className='homepage_core_right'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='homepage_open'>
        <div className='homepage_open_center'>
          <span className='homepage_open_center_title'>开箱即用</span>
          <span className='homepage_open_center_des'>你的最佳效能CP组合，你说我做</span>
          <div className='homepage_open_center_openimg'>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num1'></div>
              <span className='homepage_open_center_openbg_title'>工艺改进</span>
              <span className='homepage_open_center_openbg_des'>分析生产过程中的数据优化工艺参数，提升产品历量和生产效率</span>
            </div>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num2'></div>
              <span className='homepage_open_center_openbg_title'>语音助手与操作指导</span>
              <span className='homepage_open_center_openbg_des'>语音对话为操作工人提供事实的操作指导和支持</span>
            </div>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num3'></div>
              <span className='homepage_open_center_openbg_title'>质量控制</span>
              <span className='homepage_open_center_openbg_des'>自动检测产品缺陷，减少工人检查成本</span>
            </div>
            <div className='home_page_center_openvicter'>
              <span>零壹视界 Agents</span>
            </div>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num4'></div>
              <span className='homepage_open_center_openbg_title'>生产线优化</span>
              <span className='homepage_open_center_openbg_des'>形成生产数据报告，优化成产流程</span>
            </div>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num5'></div>
              <span className='homepage_open_center_openbg_title'>供应链管理</span>
              <span className='homepage_open_center_openbg_des'>产品需求，优化库存水平表单填写及调度实现自动化</span>
            </div>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num6'></div>
              <span className='homepage_open_center_openbg_title'>产品设计与开发</span>
              <span className='homepage_open_center_openbg_des'>提供创新的设计方案，缩短产品开发周期</span>
            </div>
            <div className='homepage_open_center_openbg'>
              <div className='homepage_open_center_openbg_num7'></div>
              <span className='homepage_open_center_openbg_title'>智能仓库管理</span>
              <span className='homepage_open_center_openbg_des'>可以优化仓库布局，提高库存管理效率，减少物流成本</span>
            </div>
          </div>
          <div className='homepage_open_center_openrelationimg'></div>
        </div>
      </div>
      <div className='homepage_case'>
        <div className='homepage_case_center'>
          <span className='homepage_case_center_title'>客户案例</span>
          <div className='homepage_case_center_caseimg'>
            <div className='homepage_case_center_caseleft'></div>
            <div className='homepage_case_center_caseright'></div>
          </div>
        </div>
      </div>
      <div className='homepage_find'>
        <div className='homepage_find_center'>
          <span className='homepage_find_center_title'>想要了解生成式AI的魅力？即刻开始发现之旅</span>
          <Button type='primary' className='homepage_find_center_btn'>去了解</Button>
        </div>
      </div>
      <div className='homepage_tail'>
        <div className='homepage_tail_center'>
          <div className='homepage_tail_center_top'>
            <div className='homepage_tail_left'></div>
            <div className='homepage_tail_middle'>
              <span className='homepage_tail_middle_reason'>为什么关注我们</span>
              <span className='homepage_tail_middle_platform'>海狸超级应用工厂是值得信赖的企业级低代码平台</span>
              <div className='homepage_tail_middle_qrcode'></div>
            </div>
            <div className='homepage_tail_right'>
              <span className='homepage_tail_right_reason'>联系方式</span>
              <span className='homepage_tail_right_span'>北京市海淀区上地三街9号C座5层C608</span>
              <span className='homepage_tail_right_span'>手机：15295555501</span>
              <span className='homepage_tail_right_span'>邮件：support@17gobig.com</span>
            </div>
          </div>
          <div className='homepage_tail_center_bottom'>
            <span>版权所有 © 2022—2024 北京零壹视界科技有限公司 丨 ICP证京B2-20160559 丨 网站备案号：京ICP备16025414号-1 丨 法律声明</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

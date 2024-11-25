import './index.css';
import { useEffect, useState, useRef } from 'react';
import { Button, Select, Dropdown, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { items, translateLang, } from './utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';
import { useGSAP } from "@gsap/react";
import ParticleEffect from './component/Particle';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const HomePage = () => {
  const [showService, setShowService] = useState(false) //是否展示我要咨询的图片
  const [hasScrolledOneScreen, setHasScrolledOneScreen] = useState(false);
  const homepageContent = useRef(); //整个容器
  const fixedElementRef = useRef(); //需要滚动固定的顶部导航
  const robotImg = useRef(null); // 引用图片元素
  const [language, setLanguage] = useState(translateLang.中文); //是否英文翻译

  useEffect(() => {
    /**可替换成useGSAP ScrollTrigger写法 开始做的时候直接写的js 可与trigger写法对比 明显会复杂一点 */
    const fixedElement = fixedElementRef.current; //获取页面和固定元素
    const pageWidth = document.documentElement.clientWidth; //获取面板的高度
    const pageHeight = document.documentElement.scrollHeight; //获取面板的高度
    //滚动监听导航栏位置固定
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = pageHeight - window.innerHeight; //最大滚动距离
      const screenHeight = window.innerHeight; //获取当前的滚动位置和视口高度，根据滚动位置判断是否为一屏滚动完位置
      /**获取第二屏的高度 */
      const secondScreen = document.getElementById('secondScreen');
      const secondScreenHeight = secondScreen.offsetHeight;
      const secondScreenTop = secondScreen.getBoundingClientRect().top;/**获取第二屏相对于视口的顶部位置 */

      //计算固定元素的Y坐标（在视口内滚动）定位
      // const elementPosition = scrollPosition < maxScroll ? scrollPosition : maxScroll;
      // gsap.to(fixedElement, { //固定导航栏的位置 
      //   y: elementPosition,
      //   duration: 0, //动画时长
      //   ease: 'none', //none匀速 power1.in先慢后快 power1.out先快后慢 power1.inOut先慢后快再慢 数字代表强度
      //   zIndex: 100,
      // });
      if (scrollPosition + 200 >= screenHeight) { //判断是否已经滚动超过一屏(+100是因为整体都向上移动了100px)
        setHasScrolledOneScreen(true);
      } else {
        setHasScrolledOneScreen(false);
      }

      /**计算滚动进度 滚动监听二屏容器滚动进度 旋转跟随二屏滚动进度 */
      const progress = Math.min(1, Math.max(0, (window.scrollY - secondScreenTop) / secondScreenHeight));
      /**使用GSAP控制元素的旋转 */
      gsap.to(robotImg.current, {
        rotationX: 30 - progress * 30,  //控制X轴的旋转
        opacity: 0.8 + progress * 0.2,
        ease: 'power3.inOut',  //设置线性过渡
        duration: 0.1, //动画时长
        willChange: 'transform,opacity'
      });
    };
    window.addEventListener('scroll', handleScroll); //添加滚动事件监听
    window.addEventListener('resize', recalculate);

    return () => { //清理滚动事件监听
      window.removeEventListener('scroll', handleScroll);
      window.addEventListener('resize', recalculate);
    };
  }, []);

  useEffect(() => {
    recalculate() //滚动监听导航栏缩小宽度
  }, [hasScrolledOneScreen]);
  
  const recalculate = () => {
    const pageWidth = document.documentElement.clientWidth; //获取面板的高度
    if (fixedElementRef.current) { //导航宽度随滚动位置宽度变化
      if (hasScrolledOneScreen) {
        if (pageWidth > 1000) {
          gsap.to(fixedElementRef.current, { width: '580px', duration: 1 }); //使用GSAP动画改变元素的宽度
        } else {
          gsap.to(fixedElementRef.current, { width: '90%', duration: 1 }); //使用GSAP动画改变元素的宽度
        }
      } else {
        if (pageWidth > 1000) {
          gsap.to(fixedElementRef.current, { width: '660px', duration: 1 }); //恢复原来的宽度
        } else {
          gsap.to(fixedElementRef.current, { width: '90%', duration: 1 }); //恢复原来的宽度
        }
      }
    }
  }

  useGSAP(() => {
    gsap.config({
      trialWarn: false,
    });

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

    /**监听二三屏滚动时的一个视口固定及内屏被盖的缩放 */
    ScrollTrigger.create({
      trigger: '.homepageApps', //滚动完二屏视口固定
      start: 'top top', //二屏顶部开始固定
      end: '+=89%', //结束固定滚动位置
      pin: true, //开启固定
      pinSpacing: false, //禁用固定时的额外空白
      // markers: true, //是否显示开始结束点标线
      willChange: 'transform', //给浏览器设置提前需要变换动画的属性类似反应时间
      onUpdate: (self) => { //回调函数监听滚动进度
        const progress = self.progress
        if (progress < 0.5) { //根据滚动进度调整图片的缩放
          gsap.to('.robotImg', { scale: 1 });  //滚动进度小于0.5时，缩放保持为1
        } else {
          const scaleValue = 1 - (progress - 0.5) * 0.08;  //根据进度缩放，最大为0.98
          gsap.to(".robotImg", { scale: scaleValue });  //滚动进度大于0.5时，按进度计算缩放值
        }
      },
    })

    /**四屏滚动翻滚特效 */
    ScrollTrigger.create({
      trigger: '.agentRobot', //触发元素
      start: 'top bottom', //四屏顶部开始
      end: '+=90%', //结束固定滚动位置
      scrub: true, //启用滚动同步动画
      // markers: true, //是否显示标记线
      onUpdate: (self) => { //回调函数监听滚动进度
        const progress = self.progress.toFixed(3)
        gsap.to('.agentbotA', {
          scaleX: 0.8 + 0.2 * progress, //缩放从0.8 ----> 1
          scaleY: 0.8 + 0.2 * progress,
          rotateY: 30 - 30 * progress, //旋转从30deg ------> 0deg
          willChange: 'transform', //性能优化 不涉及复杂一般可以不做 提前告知浏览器下一步动作
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d', //保持3D转换
        })
        gsap.to('.agentbotB', {
          scaleX: 0.8 + 0.2 * progress,
          scaleY: 0.8 + 0.2 * progress,
          rotateY: -30 + 30 * progress, //旋转从-30deg ----> 0
          willChange: 'transform',
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        })
      }
    })

    /**五屏核心产品页面
     * 海狸超级应用工厂模块
     */
    ScrollTrigger.create({
      trigger: '.coreTopLeft',
      start: 'top bottom',
      end: '+=80%',
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress.toFixed(3)
        gsap.to('.coreTopLeft', {
          opacity: 0.6 + 0.4 * progress,
          translateX: -48 + 48 * progress,
          translateY: 48 - 48 * progress,
          rotate: -8 + 8 * progress, //旋转从-8deg ------> 0deg
          rotateX: 8 - 8 * progress,
          rotateY: 8 - 8 * progress,
          willChange: 'transform,opacity', //性能优化 不涉及复杂一般可以不做 提前告知浏览器下一步动作
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d', //保持3D转换
        })
      }
    })
    /**
     * 智慧经营分析大脑模块
     */
    ScrollTrigger.create({
      trigger: '.coreTopRight',
      start: 'top bottom',
      end: '+=80%',
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress.toFixed(3)
        gsap.to('.coreTopRight', {
          opacity: 0.7 + 0.3 * progress,
          translateX: 48 - 48 * progress,
          translateY: 78 - 78 * progress,
          rotate: 7 - 7 * progress, //旋转从7deg ------> 0deg
          rotateX: 14 - 14 * progress,
          rotateY: -13 + 13 * progress,
          willChange: 'transform,opacity',
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d', //保持3D转换
        })
      }
    })
    /**
     * 超自动化助手模块
     */
    ScrollTrigger.create({
      trigger: '.coreBottom',
      start: 'top bottom',
      end: '+=64%',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress.toFixed(3)
        gsap.to('.coreBottom', {
          rotationX: 30 - progress * 30,  // 控制 X 轴的旋转
          opacity: 0.6 + progress * 0.6,
          ease: 'none',  // 设置线性过渡
          duration: 0.1, // 动画时长
          willChange: 'transform,opacity'
        });
      }
    })

    const openBgItems = gsap.utils.toArray('.openBgItem');
    openBgItems.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: '.openCenter',
        start: 'top bottom',
        scrub: true,
        once: true,
        duration: 1,
        // markers: true,
        onEnter: () => {
          // 为每个元素设置独特的入场动画，基于索引来选择方向
          // eslint-disable-next-line default-case
          switch (index) {
            case 0:
              gsap.to(item, {
                top: 0,
                left: 0,
                duration: 1
              });
              break;
            case 1:
              gsap.to(item, {
                top: 0,
                duration: 1
              });
              break;
            case 2:
              gsap.to(item, {
                top: 0,
                left: 0,
                duration: 1
              });
              break;
            case 3:
              gsap.to(item, {
                top: 0,
                left: 0,
                duration: 1
              });
              break;
            case 4:
              gsap.to(item, {
                top: 0,
                left: 0,
                duration: 1
              });
              break;
            case 5:
              gsap.to(item, {
                top: 0,
                left: 0,
                duration: 1
              });
              break;
            case 6:
              gsap.to(item, {
                top: 0,
                left: 0,
                duration: 1
              });
              break;
          }
        }
      })
    })

    ScrollTrigger.create({
      trigger: '.openRelation',
      start: 'top bottom', //元素触发位置 视口触发位置
      scrub: true,
      once: true,
      duration: 2,
      // markers: true,
      onEnter: () => {
        gsap.fromTo(".openRelation", {
          scale: 0,  // 初始缩放为0，即从消失状态开始
          transformOrigin: "center center",  // 缩放从元素的中心开始
        }, {
          scale: 1,  // 最终缩放为1，即元素恢复正常大小
          ease: 'expo.inOut',  // 使用弹性缓动，使得元素看起来像是从中心弹出
          duration: 1,  // 动画持续2秒
        });
      }
    })

    //获取跑马灯容器和内容
    const container = document.querySelector('.caseContent');
    const content = document.querySelectorAll('.caseItem')
    //获取内容总宽度
    const singleWidth = Array.from(content).reduce((acc, item) => acc + item.offsetWidth, 0);
    const gap = 12; //flex的间距
    const totalWidth = singleWidth + gap * (content.length - 1);
    //克隆内容实现无缝滚动
    const cloneCount = Math.ceil(container.offsetWidth / totalWidth) + 1;
    for (let i = 0; i < cloneCount; i++) {
      content.forEach((logo) => {
        const clone = logo.cloneNode(true);
        container.appendChild(clone);
      });
    }
    //创建跑马灯动画
    gsap.to(container, {
      x: -totalWidth, //从右向左滚动
      ease: 'none', //匀速
      duration: 12, //控制滚动速度
      repeat: -1, //无限循环
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`, //实现无缝衔接
      },
      onStart: () => gsap.set(container, { visibility: 'visible' }), //初始化后显示容器
      willChange: 'transform',
    });

    //获取二排跑马灯容器和内容
    const container1 = document.querySelector('.caseContent1');
    const content1 = document.querySelectorAll('.caseItem1')
    const singleWidth1 = Array.from(content1).reduce((acc, item) => acc + item.offsetWidth, 0);
    const totalWidth1 = singleWidth1 + gap * (content1.length - 1);
    const cloneCount1 = Math.ceil(container1.offsetWidth / totalWidth1) + 1;
    for (let i = 0; i < cloneCount1; i++) {
      content1.forEach((logo) => {
        const clone = logo.cloneNode(true);
        container1.appendChild(clone);
      });
    }
    gsap.to(container1, {
      x: totalWidth,
      ease: 'none',
      duration: 12,
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`,
      },
      onStart: () => gsap.set(container1, { visibility: 'visible' }),
      willChange: 'transform',
    });
    gsap.ticker.fps(60); //强制设置帧率为60fps
  }, { dependencies: [], scope: homepageContent, revertOnUpdate: false });

  const setServiceHandle = () => {
    setShowService(!showService)
  }
  const robotImgRightMouseEnter = (e) => { //当鼠标悬停时，触发动画
    gsap.to(e.target, {
      y: -10, //上移10像素
      scale: 1.03, //放大 1.03 倍
      rotateY: 4,
      ease: 'power2.out', //缓动效果
      willChange: 'transform',
    });
  };

  const robotImgRightMouseLeave = (e) => { //当鼠标离开时，恢复到原来的状态
    gsap.to(e.target, {
      y: 0, //恢复最初位置
      scale: 1, //恢复原始大小
      rotateY: 0,
      ease: "power2.out", //缓动效果
    });
  };
  return (
    <div className='homepage' ref={homepageContent}>
      <div className='homepage_quickly'>
        <div className='homepage_quickly_center'>
          <div className={classnames('homepage_quickly_top', 'homepage_quickly_topmin', 'quicklyTop')} ref={fixedElementRef}>
            <div className='homepage_quickly_topleft'></div>
            <div className='homepage_quickly_right'>
              <span className='homepage_quickly_right_navi'>{language === 'CHINESE' ? '产品' : 'PROD'}</span>
              <span className='homepage_quickly_right_navi'>{language === 'CHINESE' ? '最新动态' : 'NEWS'}</span>
              <Select
                className='homepage_quickly_right_select'
                defaultValue={language}
                onChange={(v) => setLanguage(v)}
                options={[
                  { value: 'CHINESE', label: '中文' },
                  { value: 'ENGLISH', label: 'ENGLISH' },
                ]}
              />
            </div>
            <div className='homepage_quickly_rightmin'>
              <Select
                className='homepage_quickly_right_select'
                defaultValue={language}
                onChange={(v) => setLanguage(v)}
                options={[
                  { value: 'CHINESE', label: '中文' },
                  { value: 'ENGLISH', label: 'ENGLISH' },
                ]}
              />
              <Dropdown menu={{ items }} trigger={['click']} rootClassName='homepage_quickly_rightmin_trop'>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <MenuOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
          <div className={classnames('homepage_quickly_center_copywrite', 'quicklyCharacter')}>
            <span className='homepage_quickly_center_copywrite_spanai'>{language === 'CHINESE' ? '快速构建AI' : 'Quickly build AI'}<span className='homepage_quickly_center_copywrite_agent'>{language === 'CHINESE' ? '智能体' : ' agents'}</span></span>
            <span className='homepage_quickly_center_copywrite_spandes'>{language === 'CHINESE' ? '由AI驱动的智能应用、数据BI分析、超自动化业务' : 'AI-driven intelligent applications, data BI analysis, and hyper-automated business'}</span>
            <div className={classnames('homepage_quickly_center_copywrite_rocket', 'quicklyRocket')}></div>
          </div>
          <div className={classnames('homepage_quickly_bottom', 'quicklyBtn')}>
            <Button type='primary' className='homepage_quickly_bottom_use'>
              <span>{language === 'CHINESE' ? '立即使用' : 'Get Started'}</span>
              <span className='homepage_quickly_bottom_usewait'>待上线</span>
            </Button>
            <Button className={classnames('homepage_quickly_bottom_apps', 'my-element')}>{language === 'CHINESE' ? '应用市场' : 'App Market'}</Button>
            <Button className='homepage_quickly_bottom_advice' onClick={setServiceHandle}>
              <span>{language === 'CHINESE' ? '我要咨询' : 'Consult'}</span>
              {
                showService ?
                  <div className='homepage_quickly_bottom_advice-img'></div> : null
              }
            </Button>
          </div>
        </div>
      </div>
      <div id="secondScreen" className={classnames('homepage_apps', 'homepageApps')} style={{ position: 'relative' }}>
        <ParticleEffect />
        <div className={classnames('homepage_apps_center')}>
          <div className='homepage_apps_top'>
            <span className='homepage_apps_top_ai'>{language === 'CHINESE' ? '创造属于你的AI应用' : 'Create your own AI application'}</span>
            <span className='homepage_apps_top_easy'>{language === 'CHINESE' ? '一站式AI智能体搭建，轻松玩转和运营AIGC激发无限潜能' : 'One-stop AI intelligent body construction, easy to play and operate AIGC to stimulate unlimited potential'}</span>
          </div>
          <div className={classnames("homepage_apps_top_robotimg", 'robotImg')} ref={robotImg}>
            <div className="homepage_apps_top_robotimg_left">
              <span className="homepage_apps_top_robotimg_left_span">{language === 'CHINESE' ? '特定领域的' : 'Specific fields'}</span>
              <span className="homepage_apps_top_robotimg_left_title">{language === 'CHINESE' ? '智能对话机器人' : 'Intelligent dialog robot'}</span>
              <span className="homepage_apps_top_robotimg_left_des">{language === 'CHINESE' ? '通过可视化的提示词编排和数据集嵌入，零代码即可快速构建对话机器人或AI助理，并可持续优化对话策略，革新人机交互体验' : 'Through visual prompt word arrangement and data set embedding, you can quickly build a conversational robot or AI assistant with zero code, and continuously optimize the conversation strategy to innovate the human-computer interaction experience.'}</span>
            </div>
            <div
              className={classnames('homepage_apps_top_robotimg_right', 'robotImgRight')}
              onMouseEnter={(e) => robotImgRightMouseEnter(e)}
              onMouseLeave={(e) => robotImgRightMouseLeave(e)}></div>
          </div>
        </div>
      </div>
      <div className={classnames('homepage_agent')}>
        <div className={classnames('homepage_agent_center', 'agentCenter')}>
          <div className={classnames("homepage_agent_agentimg", 'agentImg')}>
            <div className="homepage_agent_agentimg_left"
              onMouseEnter={robotImgRightMouseEnter}
              onMouseLeave={robotImgRightMouseLeave}
            ></div>
            <div className="homepage_agent_agentimg_right">
              <div className="homepage_agent_agentimg_right_span">{language === 'CHINESE' ? '低代码构建的' : 'Built with lowcode'}</div>
              <div className="homepage_agent_agentimg_right_title">{language === 'CHINESE' ? '智能体 Agent' : 'Excellent Agent'}</div>
              <div className="homepage_agent_agentimg_right_des">{language === 'CHINESE' ? '通过整合提示词、业务数据集与插件工具，并借助可视化和低代码的流程编排，构建面向特定业务场景的半自主智能体，从而释放个人和企业的生产力' : 'By integrating prompt words, business data sets and plug-in tools, and using visualization and low-code process orchestration, semi-autonomous intelligent entities for specific business scenarios are built to unleash the productivity of individuals and enterprises'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={classnames("homepage_agentrobot", 'agentRobot')}>
        <div className="homepage_agentrobot_center">
          <div className="homepage_agentrobot_agentrobotimg">
            <div className={classnames("homepage_agentrobot_agent", 'agentbotA')}></div>
            <div className={classnames("homepage_agentrobot_robot", 'agentbotB')}>
              <div className="homepage_agentrobot_robot_top">
                <div className="homepage_agentrobot_robot_top_title">{language === 'CHINESE' ? '智能设备/机器人交互' : 'Smart device/robot interaction'}</div>
                <div className="homepage_agentrobot_robot_top_des">{language === 'CHINESE' ? '基于大模型的深度学习和自然语言处理能力，实现智能穿戴设备对话式交互。语义感知AI交互体验，成为用户' : 'Based on the deep learning and natural language processing capabilities of large models, conversational interaction of smart wearable devices is realized. Semantic perception AI interactive experience becomes the user '}<span>{language === 'CHINESE' ? '真正的智能伴侣' : 'A true smart companion'}</span></div>
              </div>
              <div className="homepage_agentrobot_robot_bottom"></div>
            </div>
          </div>
        </div>
      </div>
      <div className='homepage_core'>
        <div className='homepage_core_center'>
          <div className='homepage_core_title'>{language === 'CHINESE' ? '核心产品' : 'Core Products'}</div>
          <div className='homepage_core_content'>
            <div className={classnames('homepage_core_top', 'coreTop')}>
              <div className={classnames('homepage_core_top_left', 'coreTopLeft')}>
                <span className='homepage_core_top_left_title'>{language === 'CHINESE' ? '海狸超级应用工厂' : 'Beaver super app factory'}</span>
                <span className='homepage_core_top_left_des'>{language === 'CHINESE' ? 'AI大模型+数字化底座，提供一站式应用构建、数据BI、超自动化和智能体能力' : 'AI big model + digital base, providing one-stop application construction, data BI, hyper-automation and intelligent agent capabilities'}</span>
                <Button type='primary' className='homepage_core_top_left_btn'>{language === 'CHINESE' ? '了解详情' : 'Learn more'}</Button>
                <div className='homepage_core_top_left_img' onMouseEnter={robotImgRightMouseEnter}
                  onMouseLeave={robotImgRightMouseLeave}></div>
              </div>
              <div className={classnames('homepage_core_top_right', 'coreTopRight')}>
                <span className='homepage_core_top_right_title'>{language === 'CHINESE' ? '智慧经营分析大脑' : 'Smart business analysis brain'}</span>
                <span className='homepage_core_top_right_des'>{language === 'CHINESE' ? 'AI大模型结合数据分析引擎，打造“可视、可控、可动”的智慧经营分析平台' : 'AI big model combined with data analysis engine to create a "visual, controllable and dynamic" intelligent business analysis platform'}</span>
                <Button type='primary' className='homepage_core_top_right_btn'>{language === 'CHINESE' ? '了解详情' : 'Learn more'}</Button>
                <div className='homepage_core_top_right_img' onMouseEnter={robotImgRightMouseEnter}
                  onMouseLeave={robotImgRightMouseLeave}></div>
              </div>
            </div>
            <div className={classnames('homepage_core_bottom', 'coreBottom')}>
              <div className='homepage_core_left'>
                <span className='homepage_core_left_title'>{language === 'CHINESE' ? '超自动化助手' : 'Hyperautomated assistant'}</span>
                <span className='homepage_core_left_des'>{language === 'CHINESE' ? 'AI大模型驱动，一句话帮您自动完成 流程任务' : 'AI big model driven, one sentence to help you automatically complete the process tasks'}
                </span>
                <Button type='primary' className='homepage_core_left_btn'>{language === 'CHINESE' ? '了解详情' : 'Learn more'}</Button>
              </div>
              <div className='homepage_core_right' onMouseEnter={robotImgRightMouseEnter}
                onMouseLeave={robotImgRightMouseLeave}></div>
            </div>
          </div>
        </div>
      </div>
      <div className='homepage_open'>
        <div className='homepage_open_center'>
          <span className='homepage_open_center_title'>{language === 'CHINESE' ? '开箱即用' : 'Ready to use'}</span>
          <span className='homepage_open_center_des'>{language === 'CHINESE' ? '你的最佳效能CP组合，你说我做' : 'Your best CP combination, you say I do'}</span>
          <div className={classnames('homepage_open_center_openimg', 'openCenter')}>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num1'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '工艺改进' : 'Process Improve'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '分析生产过程中的数据优化工艺参数，提升产品历量和生产效率' : 'improve product quality and production efficiency'}</span>
            </div>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num2'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '语音助手与操作指导' : 'Voice Operation'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '语音对话为操作工人提供事实的操作指导和支持' : 'Voice dialogue provides operators with factual operational guidance and support'}</span>
            </div>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num3'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '质量控制' : 'Quality Control'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '自动检测产品缺陷，减少工人检查成本' : 'Automatically detect product defects and reduce worker inspection costs'}</span>
            </div>
            <div className='home_page_center_openvicter'>
              <span>{language === 'CHINESE' ? '零壹视界' : 'Zero One Vision'} Agents</span>
            </div>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num4'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '生产线优化' : 'ProdLine Optimize'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '形成生产数据报告，优化成产流程' : 'Generate production data reports and optimize production processes'}</span>
            </div>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num5'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '供应链管理' : 'SupplyCh Manage'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '产品需求，优化库存水平表单填写及调度实现自动化' : 'Product demand, optimize inventory levels, automate form filling and scheduling'}</span>
            </div>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num6'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '产品设计与开发' : 'ProDes Develop'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '提供创新的设计方案，缩短产品开发周期' : 'Provide innovative design solutions and shorten product development cycle'}</span>
            </div>
            <div className={classnames('homepage_open_center_openbg', 'openBgItem')}>
              <div className='homepage_open_center_openbg_num7'></div>
              <span className='homepage_open_center_openbg_title'>{language === 'CHINESE' ? '智能仓库管理' : 'SmartWh Manage'}</span>
              <span className='homepage_open_center_openbg_des'>{language === 'CHINESE' ? '可以优化仓库布局，提高库存管理效率，减少物流成本' : 'It can optimize warehouse layout, improve inventory management efficiency, reduce logistics costs'}</span>
            </div>
          </div>
          <div className={classnames('homepage_open_center_openrelationimg', 'openRelation')}></div>
        </div>
      </div>
      <div className='homepage_case'>
        <div className='homepage_case_center'>
          <div className='homepage_case_center_eyes'></div>
          <span className='homepage_case_center_title'>{language === 'CHINESE' ? '客户案例' : 'Customer Cases'}</span>
          <div className={classnames('homepage_case_center_caseimg', 'caseImg')}>
            <div className={classnames('homepage_case_center_casecontent', 'caseContent')}>
              <div className={classnames('homepage_case_center_casecontent_logo1', 'caseItem')} alt="" />
              <div className={classnames('homepage_case_center_casecontent_logo2', 'caseItem')} alt="" />
              <div className={classnames('homepage_case_center_casecontent_logo3', 'caseItem')} alt="" />
              <div className={classnames('homepage_case_center_casecontent_logo4', 'caseItem')} alt="" />
              <div className={classnames('homepage_case_center_casecontent_logo5', 'caseItem')} alt="" />
              <div className={classnames('homepage_case_center_casecontent_logo6', 'caseItem')} alt="" />
              <div className={classnames('homepage_case_center_casecontent_logo7', 'caseItem')} alt="" />
            </div>
            <div className='homepage_case_center_caseleft'></div>
            <div className='homepage_case_center_caseright'></div>
          </div>
          <div className={classnames('homepage_case_center_caseimg', 'caseImg1')}>
            <div className={classnames('homepage_case_center_casecontent1', 'caseContent1')}>
              <div className={classnames('homepage_case_center_casecontent1_logo8', 'caseItem1')} alt="" />
              <div className={classnames('homepage_case_center_casecontent1_logo9', 'caseItem1')} alt="" />
              <div className={classnames('homepage_case_center_casecontent1_logo10', 'caseItem1')} alt="" />
              <div className={classnames('homepage_case_center_casecontent1_logo11', 'caseItem1')} alt="" />
              <div className={classnames('homepage_case_center_casecontent1_logo12', 'caseItem1')} alt="" />
              <div className={classnames('homepage_case_center_casecontent1_logo13', 'caseItem1')} alt="" />
            </div>
            <div className='homepage_case_center_caseleft'></div>
            <div className='homepage_case_center_caseright'></div>
          </div>
        </div>
      </div>
      <div className='homepage_find'>
        <div className='homepage_find_center'>
          <span className='homepage_find_center_title'>{language === 'CHINESE' ? '想要了解生成式AI的魅力？即刻开始发现之旅' : 'Want to know more about the charm of generative AI? Start your journey of discovery now'}</span>
          <Button type='primary' className='homepage_find_center_btn'>{language === 'CHINESE' ? '去了解' : 'Find out more'}</Button>
        </div>
      </div>
      <div className='homepage_tail'>
        <div className='homepage_tail_center'>
          <div className='homepage_tail_center_top'>
            <div className='homepage_tail_left'></div>
            <div className='homepage_tail_middle'>
              <span className='homepage_tail_middle_reason'>{language === 'CHINESE' ? '为什么关注我们' : 'Why follow us'}</span>
              <span className='homepage_tail_middle_platform'>{language === 'CHINESE' ? '海狸超级应用工厂是值得信赖的企业级低代码平台' : 'Beaver Super Application Factory is a trustworthy enterprise-level low-code platform'}</span>
              <div className='homepage_tail_middle_qrcode'></div>
            </div>
            <div className='homepage_tail_right'>
              <span className='homepage_tail_right_reason'>{language === 'CHINESE' ? '联系方式' : 'Contact Details'}</span>
              <span className='homepage_tail_right_span'>{language === 'CHINESE' ? '北京市海淀区上地三街9号C座5层C608' : 'Room C608, 5th Floor, Building C, No. 9 Shangdi 3rd Street, Haidian District, Beijing'}</span>
              <span className='homepage_tail_right_span'>{language === 'CHINESE' ? '手机' : 'Mobile phone'}: 15295555501</span>
              <span className='homepage_tail_right_span'>{language === 'CHINESE' ? '邮件' : 'Mail'}：support@17gobig.com</span>
            </div>
          </div>
          <div className='homepage_tail_center_bottom'>
            <span>{language === 'CHINESE' ? '版权所有 © 2022—2024 北京零壹视界科技有限公司 丨 ICP证京B2-20160559 丨 网站备案号：京ICP备16025414号-1 丨 法律声明' : 'Copyright © 2022—2024 Beijing Zero One Vision Technology Co., Ltd. | ICP Certificate Beijing B2-20160559 | Website Registration Number: Beijing ICP No. 16025414-1 | Legal Statement'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

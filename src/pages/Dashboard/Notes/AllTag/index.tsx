import './inedx.sass'
import {
    Button,
    ColorPicker,
    Form,
    Input,
    Select,
    Tag,
    Tree,
    Alert, message,
} from "antd";
import React, {useRef, useState} from "react";
import {TagsOutlined} from '@ant-design/icons'
import {myTreeNode,myFieldDataNode,newTag} from "../../../../interface/TagType";


//静态数据
const TagsData: myTreeNode[] = [
    {
        title: '前端开发',
        key: '1',
        color: 'geekblue',
        children: [
            {
                title: 'React',
                key: '101',
                color: 'geekblue',
            },
            {
                title: 'Vue.js',
                key: '102',
                color: 'geekblue',
            },
            {
                title: 'Angular',
                key: '103',
                color: 'geekblue',
            },
        ],
    },
    {
        title: '后端开发',
        color: 'lime',
        key: '2',
        children: [
            {
                title: 'Node.js',
                key: '201',
                color: 'lime',
            },
            {
                title: 'Django',
                key: '202',
                color: 'lime',
            },
            {
                title: 'Spring Boot',
                key: '203',
                color: 'lime',
            },
        ],
    },
    {
        title: '移动端开发',
        color: 'gold',
        key: '3',
        children: [
            {
                title: 'React Native',
                key: '301',
                color: 'gold',
            },
            {
                title: 'Flutter',
                key: '302',
                color: 'gold',
            },
            {
                title: 'Swift',
                key: '303',
                color: 'gold',
            },
        ],
    },
    {
        title: '数据科学',
        key: '4',
        color: 'cyan',
        children: [
            {
                title: '机器学习',
                key: '401',
                color: 'cyan',
            },
            {
                title: '数据分析',
                key: '402',
                color: 'cyan',
            },
            {
                title: '人工智能',
                key: '403',
                color: 'cyan',
            },
        ],
    },
];
const AllTag = () => {
    // hooks区域
    const tree = useRef(null)
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [level,setLevel] = useState('level_1')
    const [staticDate,setStaticDate] = useState(TagsData)

    //回调函数
    const onSelect = (selectedKeysValue: React.Key[]) => {
        setSelectedKeys(selectedKeysValue);
    };

    const handleTagTypeChange = (value:string) => {
        setLevel(value);
    };

    const Delete = () => {
        if (selectedKeys.length === 0){
            message.warning('待选中')
            return
        }

        setStaticDate(staticDate.filter(tag => {
            // 如果当前标签被选中，直接过滤掉
            if (selectedKeys.includes(tag.key)) {
                message.success('删除成功')
                return false;
            }
            // 如果当前标签是一个父标签，并且其下有子标签被选中，则过滤掉
            if (tag.children && tag.children.some(child => selectedKeys.includes(child.key))) {
                tag.children = tag.children.filter(child => !selectedKeys.includes(child.key));
                message.success('删除成功')
            }
            return true;
        }));
        setSelectedKeys([]); // 清空选中的标签
        if(tree.current)
            { // @ts-ignore
                tree.current.state.selectedKeys = []
            }
    };
    const onfinish = (values: newTag) => {
        if (values.level === 'level_1') {
            let color:string
            if (values.color && values.color.toHexString) {
                color = values.color.toHexString(); // 如果存在有效颜色并且具有 toHexString 方法，则转换为十六进制
            } else {
                color = 'black'; // 否则使用默认颜色 #fff
            }

            const newTag: myTreeNode = {
                title: values.title,
                key: staticDate.length + 1,
                color: color,
                children: []
            };

            if (!staticDate.find(item => item.title === newTag.title)) {
                setStaticDate([
                    ...staticDate,
                    newTag
                ]);
                message.success('添加成功');
            } else {
                message.error('一级标签已经存在');
            }
        } else {
            const fatherTag = staticDate.find(item => item.key === values.parentTag);
            if (fatherTag&&fatherTag.children) {
                const len = fatherTag.children?.length
                const newTag: myFieldDataNode = {
                    title: values.title,
                    // @ts-ignore
                    key: (parseInt(fatherTag.children[len-1].key)+1).toString(),
                    color: fatherTag.color,
                }
                if(!fatherTag.children?.find(item => item.title ===  newTag.title)){
                    fatherTag?.children.push(newTag)
                    message.success('添加成功')
                    setStaticDate([...staticDate])
                }else {
                    message.error('二级标签已经存在')
                }
            }
        }
    }

    return <>
        <div className="tag_card">
            <div className='newTagForm'>
                <Form
                    // onFinish={onFinish}
                    initialValues={{ tagType: '一级标签' }}
                    style={{ maxWidth: '400px' }}
                    name="标签管理"
                    onFinish={onfinish}
                >
                    <h2 style={{ marginBottom: '20px' }}><TagsOutlined /> 标签管理</h2>
                    <Form.Item
                        name="title"
                        label="标签名称"
                        rules={[{ required: true ,message: '必填项' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="标签等级"
                    >
                        <Select options={[
                            { value: 'level_1', label: '一级标签' },
                            { value: 'level_2', label: '二级标签' },
                        ]} onChange={handleTagTypeChange}/>
                    </Form.Item>

                    {level==='level_2'&& <Form.Item
                        name="parentTag"
                        label="父标签"
                        shouldUpdate
                    >
                        <Select options={staticDate.map(({ children, ...rest }) => ({ ...rest })).map(tag => ({
                            value: tag.key,
                            label: tag.title
                        }))} />
                    </Form.Item>}

                    {level==='level_1'&& <Form.Item
                        name="color"
                        label="标签颜色"
                    >
                        <ColorPicker defaultValue="black" showText format={"hex"}/>
                    </Form.Item>}

                    <Form.Item>
                        <Button type="primary"  htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" style={{marginLeft: 20,backgroundColor: '#f5222d'}} onClick={Delete}>
                            删除
                        </Button>

                    </Form.Item>
                    <Alert message={`选中删除标签：${selectedKeys.length} 个`} type="warning" showIcon style={{position: 'absolute',transition: '0.3s',opacity: selectedKeys.length===0?0:1}}/>
                </Form>
            </div>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',height:'100%'}}>
                <Tree
                    showLine
                    multiple
                    defaultExpandAll
                    onSelect={onSelect}
                    treeData={staticDate}
                    titleRender={(node) => (
                        // @ts-ignore
                        <Tag color={node.color}>{node.title}</Tag>
                    )}
                    ref={tree}
                    virtual={true}
                    height={500}
                />
            </div>

        </div>
    </>
}

export default  AllTag
import { HomeTwoTone } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Typography } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { IPost } from 'posts';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

type ICreatePost = Omit<IPost, 'id'>;

interface CreateFormProps {
  post: IPost | null;
}

const { Item, useForm } = Form;

export const CreateForm = ({ post }: CreateFormProps) => {
  const client = useQueryClient();
  const [form] = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICreatePost) =>
      post
        ? axios.patch<ICreatePost>(
            `${process.env.REACT_APP_API_URL}/posts/${post.id}`,
            data
          )
        : axios.post<ICreatePost>(
            `${process.env.REACT_APP_API_URL}/posts`,
            data
          ),
    onSuccess: ({ data }) => {
      client.setQueryData(
        ['posts'],
        (oldData: AxiosResponse<IPost[]> | undefined) =>
          oldData && {
            ...oldData,
            data: post
              ? oldData.data.map((el) => (el.id === post.id ? data : el))
              : [data, ...oldData.data]
          }
      );
    },
    onSettled: () => form.resetFields()
  });

  useEffect(() => {
    if (post) form.setFieldsValue(post);
  }, [post]);

  return (
    <>
      <Typography.Title level={3}>
        <Link to="/">
          <HomeTwoTone />
        </Link>
        {' / '}
        {post ? 'Update post' : 'Create post'}
      </Typography.Title>
      <Form<ICreatePost>
        layout="vertical"
        onFinish={(values) => mutate(values)}
        form={form}
      >
        <Item<ICreatePost> name="title" label="Post title">
          <Input placeholder="New Post" />
        </Item>
        <Item<ICreatePost> name="content" label="Post content">
          <Input.TextArea
            placeholder="Text..."
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Item>
        <Button loading={isPending} type="primary" htmlType="submit">
          {post ? 'Update post' : 'Create post'}
        </Button>
      </Form>
    </>
  );
};

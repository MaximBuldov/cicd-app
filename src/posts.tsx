import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Flex, Layout, Result } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { CreateForm } from 'create-post';
import { useState } from 'react';

export interface IPost {
  id: number;
  title: string;
  content: string;
}

export const Posts = () => {
  const client = useQueryClient();
  const [editPost, setEditPost] = useState<null | IPost>(null);
  const { data, isPending, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: () => axios.get<IPost[]>(`${process.env.REACT_APP_API_URL}/posts`),
    select: ({ data }) => data
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      axios.delete<IPost>(`${process.env.REACT_APP_API_URL}/posts/${id}`),
    onSuccess: ({ data }) => {
      client.setQueryData(
        ['posts'],
        (oldData: AxiosResponse<IPost[]> | undefined) =>
          oldData && {
            ...oldData,
            data: oldData.data.filter((el) => el.id !== data.id)
          }
      );
    }
  });

  return (
    <Layout>
      <Layout.Content style={{ padding: 48, minHeight: '100vh' }}>
        <Flex justify="space-between" gap="large">
          <div style={{ width: '50%' }}>
            <CreateForm post={editPost} />
          </div>
          <div
            style={{
              width: '50%',
              maxHeight: 'calc(100vh - 96px)',
              overflowY: 'auto'
            }}
          >
            {isError ? (
              <Result
                status="500"
                title="Error"
                subTitle="Sorry, something went wrong."
              />
            ) : (
              <Flex vertical gap="small">
                {data?.map((post) => (
                  <Card
                    title={post.title}
                    extra={
                      <Flex gap="small">
                        <EditTwoTone onClick={() => setEditPost(post)} />
                        <DeleteTwoTone
                          twoToneColor="#eb2f96"
                          onClick={() => remove.mutate(post.id)}
                        />
                      </Flex>
                    }
                    style={{ width: '100%' }}
                    size="small"
                    loading={isPending || remove.isPending}
                  >
                    {post.content}
                  </Card>
                ))}
              </Flex>
            )}
          </div>
        </Flex>
      </Layout.Content>
    </Layout>
  );
};

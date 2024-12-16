import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { useDisclosure } from '@nextui-org/react';
import { Tooltip } from '@nextui-org/tooltip';
import type { Todo } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFetcher } from 'react-router';
import { action as todosPageAction } from '~/routes/todos';

/**
 * Delete todo component.
 * @param {Todo} todo - The todo to delete.
 */
export default function DeleteTodo(todo: Todo) {
  const fetcher = useFetcher<typeof todosPageAction>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
      toast.success('Todo deleted successfully');
    }
  }, [fetcher.data]);

  const deletingTodo = fetcher.state !== 'idle';

  return (
    <>
      <Tooltip content="Delete">
        <div
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-danger/20 transition-colors hover:bg-danger/30"
          onClick={onOpen}
        >
          <Trash2 className="text-danger" size={15} />
        </div>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-bold">Warning</h2>
              </ModalHeader>

              <ModalBody>
                <p>
                  You are about to delete the todo{' '}
                  <span className="font-bold italic">{todo.name}</span> and this
                  action is irreversible. Are you sure you want to to proceed?
                </p>
              </ModalBody>

              <ModalFooter>
                <Button onPress={onClose}>Close</Button>

                <fetcher.Form method="post">
                  <input
                    name="action"
                    id="action"
                    type="hidden"
                    value="deleteTodo"
                  />

                  <input
                    name="todoId"
                    id="todoId"
                    type="hidden"
                    value={todo.id}
                  />

                  <Button type="submit" color="danger" isLoading={deletingTodo}>
                    Delete
                  </Button>
                </fetcher.Form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

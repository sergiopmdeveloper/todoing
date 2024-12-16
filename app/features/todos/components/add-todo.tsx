import { Button } from '@nextui-org/button';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { useDisclosure } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/select';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFetcher, useParams } from 'react-router';
import FieldError from '~/components/field-error';
import { action as todosPageAction } from '~/routes/todos';
import { TODOS_PRIORITIES } from '../constants';

/**
 * Add todo component.
 */
export default function AddTodo() {
  const { userId } = useParams();
  const fetcher = useFetcher<typeof todosPageAction>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
      toast.success('Todo added successfully');
    }
  }, [fetcher.data]);

  const nameErrors = fetcher.data && fetcher.data.fieldErrors?.todoName;
  const priorityErrors = fetcher.data && fetcher.data.fieldErrors?.todoPriority;
  const addingTodo = fetcher.state !== 'idle';

  return (
    <>
      <Button
        size="sm"
        color="primary"
        onPress={onOpen}
        endContent={<Plus size={15} />}
      >
        Add todo
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-2xl font-bold">Add new todo</h2>
              </ModalHeader>

              <fetcher.Form method="post">
                <ModalBody>
                  <input
                    name="action"
                    id="action"
                    type="hidden"
                    value="addTodo"
                  />

                  <input
                    name="userId"
                    id="userId"
                    type="hidden"
                    value={userId}
                  />

                  <div className="space-y-4">
                    <Input
                      id="todoName"
                      name="todoName"
                      placeholder="Todo name..."
                      autoComplete="off"
                      label="Todo name"
                      isInvalid={!!nameErrors}
                      errorMessage={
                        nameErrors && <FieldError>{nameErrors[0]}</FieldError>
                      }
                      isRequired
                    />

                    <Textarea
                      id="todoDescription"
                      name="todoDescription"
                      placeholder="Todo description..."
                      autoComplete="off"
                      label="Todo description"
                    />

                    <Select
                      id="todoPriority"
                      name="todoPriority"
                      placeholder="Todo priority..."
                      label="Todo priority"
                      isInvalid={!!priorityErrors}
                      errorMessage={
                        priorityErrors && (
                          <FieldError>{priorityErrors[0]}</FieldError>
                        )
                      }
                    >
                      {TODOS_PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <DatePicker
                      id="todoDeadline"
                      name="todoDeadline"
                      label="Todo deadline"
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button onPress={onClose}>Cancel</Button>

                  <Button
                    type="submit"
                    color="primary"
                    isLoading={addingTodo}
                    fullWidth
                  >
                    Save
                  </Button>
                </ModalFooter>
              </fetcher.Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

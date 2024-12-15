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
import { useFetcher } from 'react-router';
import { action as todosPageAction } from '~/routes/todos';
import { TODOS_PRIORITIES } from '../constants';

/**
 * Add todo component.
 */
export default function AddTodo() {
  const fetcher = useFetcher<typeof todosPageAction>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                  <div className="space-y-4">
                    <Input
                      id="todo-name"
                      name="todo-name"
                      placeholder="Todo name..."
                      autoComplete="off"
                      label="Todo name"
                      isRequired
                    />

                    <Textarea
                      id="todo-description"
                      name="todo-description"
                      placeholder="Todo description..."
                      autoComplete="off"
                      label="Todo description"
                    />

                    <Select
                      id="todo-priority"
                      name="todo-priority"
                      placeholder="Todo priority..."
                      label="Todo priority"
                      isRequired
                    >
                      {TODOS_PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <DatePicker
                      id="todo-deadline"
                      name="todo-deadline"
                      label="Todo deadline"
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button type="submit" onPress={onClose}>
                    Cancel
                  </Button>

                  <Button type="submit" color="primary" fullWidth>
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

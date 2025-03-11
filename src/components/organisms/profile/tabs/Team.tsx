'use client';

import { AddOutlined, MoreHorizOutlined } from "@mui/icons-material";
import { Key, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
} from "@nextui-org/react";

interface TeamMemberProps {
  name: string;
  email: string;
  id: string;
}

const TEAM_MEMBERS: TeamMemberProps[] = [
  {
    name: "Tony Reichert",
    email: "tony.reichert@example.com",
    id: "uuid-for-tony",
  },
  {
    name: "Zoey Lang",
    email: "zoey.lang@example.com",
    id: "uuid-for-zoey",
  },
  {
    name: "Jane Fisher",
    email: "jane.fisher@example.com",
    id: "uuid-for-jane",
  },
  {
    name: "William Howard",
    email: "william.howard@example.com",
    id: "uuid-for-william",
  },
];

const columns = [
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "email",
    label: "E-mail",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

export default function Team() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));

  // TO DO unavaible rows by user role inside a plan or permission
  // example: user are not admin and wants to remove some access from a user that is admin or owner
  const disabledRows = useMemo(
    () => new Set(["uuid-for-william", "uuid-for-tony"]),
    []
  );

  const renderCell = useCallback(
    (member: TeamMemberProps, columnKey: Key) => {
      const cellValue = member[columnKey as keyof TeamMemberProps];

      switch (columnKey) {
        case "name":
          return (
            <p className="whitespace-nowrap text-bold text-xs lg:text-sm xl:text-base capitalize">
              {cellValue}
            </p>
          );
        case "email":
          return (
            <p className="text-bold text-xs lg:text-sm xl:text-base capitalize">
              {cellValue}
            </p>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown isDisabled={disabledRows.has(member.id)}>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreHorizOutlined className="text-font-medium" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="edit">Editar</DropdownItem>
                  <DropdownItem key="revoke-access">
                    Remover acesso
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [disabledRows]
  );

  return (
    <main className="flex flex-col gap-8 w-full py-4 lg:px-8">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-lg xl:text-xl font-medium">Membros</h3>

        <Button
          startContent={<AddOutlined />}
          className="btn btn-primary-gradient w-fit"
        >
          Convidar membro
        </Button>
      </div>
      <section className="w-full flex flex-col gap-2">
        <Table
          aria-label="Team members table"
          selectionMode="multiple"
          classNames={{
            wrapper: "border-none shadow-none stroke-none",
            tr: "border-b-1 border-background-light",
          }}
          disabledKeys={disabledRows}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                align={column.key === "actions" ? "center" : "start"}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={TEAM_MEMBERS}
            emptyContent={"Nenhum usuário encontrado"}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}

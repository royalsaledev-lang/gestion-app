import { ReactNode } from "react"

interface TableProps {
  children: ReactNode
}

export function Table({ children }: TableProps) {
  return (
    <table className="w-full text-sm">
      {children}
    </table>
  )
}

interface TableHeaderProps {
  children: ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="border-b">
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: ReactNode
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody>
      {children}
    </tbody>
  )
}

interface TableRowProps {
  children: ReactNode
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      {children}
    </tr>
  )
}

interface TableHeadProps {
  children: ReactNode
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <th className="text-left p-3 font-medium">
      {children}
    </th>
  )
}

interface TableCellProps {
  children: ReactNode
}

export function TableCell({ children }: TableCellProps) {
  return (
    <td className="p-3 border-b">
      {children}
    </td>
  )
}


// export function Table({ children }: any) {
//   return <table className="w-full text-sm">{children}</table>
// }

// export function TableHeader({ children }: any) {
//   return <thead className="border-b">{children}</thead>
// }

// export function TableBody({ children }: any) {
//   return <tbody>{children}</tbody>
// }

// export function TableRow({ children }: any) {
//   return <tr className="hover:bg-gray-50">{children}</tr>
// }

// export function TableHead({ children }: any) {
//   return <th className="text-left p-3 font-medium">{children}</th>
// }

// export function TableCell({ children }: any) {
//   return <td className="p-3 border-b">{children}</td>
// }
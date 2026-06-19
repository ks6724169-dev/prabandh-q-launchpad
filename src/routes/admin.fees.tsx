import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Receipt, Printer, Sparkles, CheckCircle2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { getFees, setFeesStore, inr, useTenant, type FeeRecord } from "@/components/tenant";

export const Route = createFileRoute("/admin/fees")({
  component: Fees,
});

function Fees() {
  const tenant = useTenant();
  const [fees, setFees] = useState<FeeRecord[]>(getFees());
  const [f, setF] = useState({ studentName: "", amount: "", mode: "UPI" as FeeRecord["mode"] });
  const [receipt, setReceipt] = useState<FeeRecord | null>(null);

  const record = () => {
    const amt = Number(f.amount);
    if (!f.studentName || !amt) { toast.error("Student name and amount are required."); return; }
    const r: FeeRecord = {
      id: Math.random().toString(36).slice(2, 10),
      studentName: f.studentName,
      amount: amt,
      mode: f.mode,
      date: new Date().toLocaleDateString("en-IN"),
      receiptNo: "PQ-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    const arr = [r, ...fees];
    setFees(arr); setFeesStore(arr);
    setF({ studentName: "", amount: "", mode: "UPI" });
    setReceipt(r);
    toast.success("Fee payment recorded.");
  };

  const total = fees.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Fees Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Record payments and issue branded receipts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-emerald/15 text-accent-emerald"><Wallet className="h-5 w-5" /></span>
            <div><p className="text-xs text-muted-foreground">Total Collected</p><p className="font-display text-xl font-extrabold">{inr(total)}</p></div>
          </div>
        </Card>
        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Receipt className="h-5 w-5" /></span>
            <div><p className="text-xs text-muted-foreground">Receipts Issued</p><p className="font-display text-xl font-extrabold">{fees.length}</p></div>
          </div>
        </Card>
        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><CheckCircle2 className="h-5 w-5" /></span>
            <div><p className="text-xs text-muted-foreground">Avg. Payment</p><p className="font-display text-xl font-extrabold">{inr(fees.length ? Math.round(total / fees.length) : 0)}</p></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card className="bg-gradient-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold">Record a payment</h2>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Student name</Label>
              <Input value={f.studentName} onChange={(e) => setF({ ...f, studentName: e.target.value })} placeholder="e.g. Aarav Sharma" />
            </div>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="12000" />
            </div>
            <div className="space-y-1.5">
              <Label>Payment mode</Label>
              <Select value={f.mode} onValueChange={(v) => setF({ ...f, mode: v as FeeRecord["mode"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={record} className="w-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95">
              <Receipt className="mr-1.5 h-4 w-4" /> Record & Issue Receipt
            </Button>
          </div>
        </Card>

        <Card className="bg-gradient-card p-4 shadow-soft sm:p-6">
          <h2 className="font-display text-lg font-bold">Recent payments</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-border/60 bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Mode</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No payments yet.</TableCell></TableRow>
                ) : fees.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell>{inr(r.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{r.mode}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{r.date}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => setReceipt(r)}>
                        <Receipt className="mr-1 h-3.5 w-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="sm:max-w-md print:shadow-none">
          <DialogHeader><DialogTitle className="sr-only">Receipt</DialogTitle></DialogHeader>
          {receipt && (
            <div id="receipt-card" className="overflow-hidden rounded-xl border border-border/60 bg-background">
              <div className="bg-gradient-hero p-5 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15"><Sparkles className="h-4 w-4" /></span>
                    <div>
                      <p className="font-display text-base font-extrabold">Prabandh Q</p>
                      <p className="text-[10px] uppercase tracking-wider text-primary-foreground/80">Official Fee Receipt</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="opacity-80">Receipt #</p>
                    <p className="font-mono text-sm font-bold">{receipt.receiptNo}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <Row label="Institute" value={tenant.name} />
                <Row label="Student" value={receipt.studentName} />
                <Row label="Date" value={receipt.date} />
                <Row label="Mode" value={receipt.mode} />
                <div className="mt-4 flex items-end justify-between rounded-lg bg-accent-emerald/10 p-4">
                  <span className="text-xs uppercase tracking-wider text-accent-foreground">Amount Paid</span>
                  <span className="font-display text-2xl font-extrabold text-accent-emerald">{inr(receipt.amount)}</span>
                </div>
                <p className="pt-2 text-center text-[10px] text-muted-foreground">
                  Thank you for your payment. This is a computer-generated receipt.
                </p>
              </div>
              <div className="flex gap-2 border-t border-border/60 p-3 print:hidden">
                <Button variant="ghost" className="flex-1" onClick={() => setReceipt(null)}>Close</Button>
                <Button className="flex-1 bg-gradient-hero text-primary-foreground" onClick={() => window.print()}>
                  <Printer className="mr-1.5 h-4 w-4" /> Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

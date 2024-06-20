export type VMOptions = {
    name: string;
    iso?: string;
    ram?: string;
    disk?: string;
    cpu?: string;
    network?: string;
    osVariant?: string;
    bootOption?: 'mbr' | 'uefi';
    arch?: 'x64' | 'x86';  // Add an architecture option
    username?: string;
    password?: string;
  }
  